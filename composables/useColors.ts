import { fetchUniqueColors, fetchColorByHex } from '~/services/colors';
import type { Color } from '~/server/api/colors/types';
import {
    DEFAULT_SATURATION,
    DEFAULT_LIGHTNESS,
    COLOR_BLACK,
    COLOR_WHITE,
} from '~/composables/constants';

/**
 * Manages fetching and caching color data from the service.
 * Caches both batch (saturation/lightness) lookups and individual color lookups.
 */
export function useColors(
    colorSaturation = DEFAULT_SATURATION,
    colorLightness = DEFAULT_LIGHTNESS,
) {
    // Cache for batch color lookups (keyed by saturation-lightness)
    const colors = useState<Color[]>('cachedColors', () => []);
    const cache = useState<Record<string, Color[]>>('colorCache', () => ({}));

    // Cache for individual color lookups (keyed by normalized hex value)
    const colorByHexCache = useState<Record<string, Color>>('colorByHexCache', () => ({}));

    const loading = ref(false);
    const lastRequestCached = ref(false);
    const lastRequestTime = ref(0);
    const lastRequestCount = ref(0);

    async function getColors(saturation: number, lightness: number): Promise<Color[]> {
        const cacheKey = `${saturation}-${lightness}`;
        const startTime = performance.now();

        lastRequestCount.value = 0;
        lastRequestTime.value = 0;
        lastRequestCached.value = false;
        colors.value = [];

        // Return cached batch if available
        if (cache.value[cacheKey]) {
            colors.value = cache.value[cacheKey];
            lastRequestCached.value = true;
            return colors.value;
        }

        loading.value = true;

        try {
            let fetchedColors: Color[];

            // Directly return black or white if lightness is 0 or 100
            if (lightness === 0) {
                fetchedColors = [COLOR_BLACK];
                lastRequestCached.value = true;
            } else if (lightness === 100) {
                fetchedColors = [COLOR_WHITE];
                lastRequestCached.value = true;
            } else {
                const response = await fetchUniqueColors(saturation, lightness);
                fetchedColors = response.colors;
                lastRequestCount.value = response.requestCount;
            }

            // Cache the fetched batch and update state
            cache.value[cacheKey] = fetchedColors;
            colors.value = fetchedColors;

            return fetchedColors;
        } catch (err) {
            console.error(err);
            return [];
        } finally {
            lastRequestTime.value = performance.now() - startTime;
            loading.value = false;
        }
    }

    async function getColorsByHex(hex: string): Promise<Color[]> {
        const normalizedHex = hex.toLowerCase();

        if (colorByHexCache.value[normalizedHex]) {
            return [colorByHexCache.value[normalizedHex]];
        }

        try {
            return await fetchColorByHex(normalizedHex);
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    // Fetch default colors using SSR and hydrate on client
    const { data } = useAsyncData(
        `colors-${colorSaturation}-${colorLightness}`,
        () => getColors(colorSaturation, colorLightness),
        { lazy: true },
    );

    // Keep colors reactive across SSR and CSR
    watchEffect(() => {
        if (data.value) {
            cache.value[`${colorSaturation}-${colorLightness}`] = data.value;
            colors.value = data.value;
        }
    });

    return {
        colors,
        loading,
        getColors,
        getColorsByHex,
        lastRequestTime,
        lastRequestCount,
        lastRequestCached,
    };
}
