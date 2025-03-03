import { ref, watchEffect } from 'vue';
import { useAsyncData, useState } from '#app';
import type { Color } from '~/services/colors/types';
import { fetchUniqueColors } from '~/services/colors';
import {
    DEFAULT_SATURATION,
    DEFAULT_LIGHTNESS,
    COLOR_BLACK,
    COLOR_WHITE,
} from '~/composables/constants';

/**
 * Manages fetching and caching color data from the service
 */
export function useColors(
    colorSaturation = DEFAULT_SATURATION,
    colorLightness = DEFAULT_LIGHTNESS,
) {
    const colors = useState<Color[]>('cachedColors', () => []);
    // TODO: Is caching better off in the service?
    const cache = useState<Record<string, Color[]>>('colorCache', () => ({}));
    const loading = ref(false);
    const lastRequestCached = ref(false);
    const lastRequestTime = ref(0);
    const lastRequestCount = ref(0);

    async function fetchColors(saturation: number, lightness: number): Promise<Color[]> {
        const cacheKey = `${saturation}-${lightness}`;
        const startTime = performance.now();

        lastRequestCount.value = 0;
        lastRequestTime.value = 0;
        lastRequestCached.value = false;
        colors.value = [];

        if (cache.value[cacheKey]) {
            colors.value = cache.value[cacheKey];
            lastRequestCached.value = true;
            return colors.value;
        }

        loading.value = true;

        try {
            let fetchedColors: Color[];

            // If lightness is 0 or 100, we can return black or white directly
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

            // Store in cache and update reactive state
            cache.value[cacheKey] = fetchedColors;
            colors.value = fetchedColors;

            return fetchedColors;
        } catch (err) {
            console.log(err);
            return [];
        } finally {
            lastRequestTime.value = performance.now() - startTime;
            loading.value = false;
        }
    }

    // Fetch default colors using SSR and hydrate on client
    const { data } = useAsyncData(
        `colors-${colorSaturation}-${colorLightness}`,
        async () => await fetchColors(colorSaturation, colorLightness),
        { lazy: true },
    );

    // Keep colors reactive across SSR and CSR
    // Watches for changes to ssr data and updates the colors state
    watchEffect(() => {
        if (data.value) {
            cache.value[`${colorSaturation}-${colorLightness}`] = data.value;
            colors.value = data.value;
        }
    });

    return {
        colors,
        loading,
        fetchColors,
        // TODO: Hydration mismatch between SSR and CSR
        lastRequestTime,
        lastRequestCount,
        lastRequestCached,
    };
}
