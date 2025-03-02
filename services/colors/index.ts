import type { ColorApiResponse, Color } from './types';
import { mapColorApiResponseToColor } from './mappers';
import { BATCH_SIZE, API_URL } from './constants';

export async function fetchColor(
    hue: number,
    saturation: number,
    lightness: number,
): Promise<Color> {
    const response = await $fetch<ColorApiResponse>(
        `${API_URL}?hsl=${hue},${saturation}%,${lightness}%`,
    );

    return mapColorApiResponseToColor(response);
}

export async function fetchColorBatch(
    hues: number[],
    saturation: number,
    lightness: number,
): Promise<Color[]> {
    const { t: $t } = useI18n();
    const seenNames = new Set<string>();
    let fetchedColors: Color[] = [];

    for (let i = 0; i < hues.length; i += BATCH_SIZE) {
        const batch = hues.slice(i, i + BATCH_SIZE);
        try {
            // Fetch all colors
            const results = await Promise.allSettled(
                batch.map((hue) => fetchColor(hue, saturation, lightness)),
            );

            // Extract only successful responses
            const validColors = results
                .filter((result) => result.status === 'fulfilled')
                .map((result) => (result as PromiseFulfilledResult<Color>).value);

            // Append new colors
            fetchedColors = [...fetchedColors, ...validColors];
        } catch (err) {
            console.error($t('colorserror'), err);
        }
    }

    // Remove duplicates while preserving order
    return fetchedColors.filter((color) => {
        if (color.name !== color.hex && !seenNames.has(color.name)) {
            seenNames.add(color.name);
            return true;
        }
        return false;
    });
}
