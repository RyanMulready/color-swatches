import type { ColorApiResponse, Color } from './types';
import { mapColorApiResponseToColor } from './mappers';
import { BATCH_SIZE, API_URL } from './constants';

let requestCount = 0;

export async function fetchColor(
    hue: number,
    saturation: number,
    lightness: number,
): Promise<Color> {
    requestCount += 1;

    const response = await $fetch<ColorApiResponse>(
        `${API_URL}?hsl=${hue},${saturation},${lightness}`,
    );

    return mapColorApiResponseToColor(response);
}

export async function fetchUniqueColors(
    saturation: number,
    lightness: number,
): Promise<{ colors: Color[]; requestCount: number }> {
    const hues = Array.from({ length: 361 }, (_, i) => i);
    const seenNames = new Set<string>();
    let fetchedColors: Color[] = [];
    requestCount = 0;

    for (let i = 0; i < hues.length; i += BATCH_SIZE) {
        const batch = hues.slice(i, i + BATCH_SIZE);
        try {
            const results = await Promise.allSettled(
                batch.map((hue) => fetchColor(hue, saturation, lightness)),
            );

            const validColors = results
                .filter((result) => result.status === 'fulfilled')
                .map((result) => (result as PromiseFulfilledResult<Color>).value);

            fetchedColors = [...fetchedColors, ...validColors];
        } catch (err) {
            console.error(err);
        }
    }

    const uniqueColors = fetchedColors.filter((color) => {
        if (color.name !== color.hex && !seenNames.has(color.name)) {
            seenNames.add(color.name);
            return true;
        }
        return false;
    });

    return {
        colors: uniqueColors,
        requestCount,
    };
}
