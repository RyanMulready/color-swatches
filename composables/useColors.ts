import { ref, watchEffect } from 'vue';
import { useAsyncData, useState } from '#app';
import type { Color } from '~/services/colors/types';
import { fetchColorBatch } from '~/services/colors';
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
    const { t: $t } = useI18n();

    const colors = useState<Color[]>('cachedColors', () => []);
    // TODO: Is caching better off in the service?
    const cache = useState<Record<string, Color[]>>('colorCache', () => ({}));

    const error = ref<string | null>(null);
    const loading = ref(false);

    async function fetchColors(saturation: number, lightness: number): Promise<Color[]> {
        error.value = null;
        const cacheKey = `${saturation}-${lightness}`;

        if (cache.value[cacheKey]) {
            colors.value = cache.value[cacheKey];
            return colors.value;
        }

        loading.value = true;
        try {
            let fetchedColors: Color[];

            // If lightness is 0 or 100, we can return black or white directly
            if (lightness === 0) {
                fetchedColors = [COLOR_BLACK];
            } else if (lightness === 100) {
                fetchedColors = [COLOR_WHITE];
            } else {
                const hues = Array.from({ length: 361 }, (_, i) => i);
                fetchedColors = await fetchColorBatch(hues, saturation, lightness);
            }

            // Store in cache and update reactive state
            cache.value[cacheKey] = fetchedColors;
            colors.value = fetchedColors;

            return fetchedColors;
        } catch (err) {
            error.value = err instanceof Error ? err.message : $t('unknownerror');
            return [];
        } finally {
            loading.value = false;
        }
    }

    // Fetch default colors using SSR and hydrate on client
    const { data } = useAsyncData(
        `colors-${colorSaturation}-${colorLightness}`,
        async () => {
            return await fetchColors(colorSaturation, colorLightness);
        },
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
        error,
        fetchColors,
    };
}
