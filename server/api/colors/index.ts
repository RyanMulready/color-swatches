import { BATCH_SIZE, API_URL } from './constants';
import { mapColorApiResponseToColor } from './mappers';
import type { Color, ColorApiResponse } from './types';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const saturation = parseInt(query.saturation as string, 10);
    const lightness = parseInt(query.lightness as string, 10);

    if (Number.isNaN(saturation) || Number.isNaN(lightness)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or missing saturation/lightness parameters',
        });
    }

    let requestCount = 0;
    const hues = Array.from({ length: 361 }, (_, i) => i);
    const seenNames = new Set<string>();
    let fetchedColors: Color[] = [];

    // Helper to fetch a single color
    async function fetchColor(hue: number): Promise<Color> {
        requestCount += 1;
        const resp = await fetch(`${API_URL}/id?hsl=${hue},${saturation},${lightness}`);
        if (!resp.ok) {
            throw new Error(`Failed to fetch color: ${resp.statusText}`);
        }
        const data: ColorApiResponse = await resp.json();
        return mapColorApiResponseToColor(data);
    }

    // Batch hues
    for (let i = 0; i < hues.length; i += BATCH_SIZE) {
        const batch = hues.slice(i, i + BATCH_SIZE);

        try {
            // Use Promise.allSettled for robust error handling
            const results = await Promise.allSettled(batch.map(fetchColor));
            const fulfilledColors = results
                .filter((r) => r.status === 'fulfilled')
                .map((r) => (r as PromiseFulfilledResult<Color>).value);
            fetchedColors = [...fetchedColors, ...fulfilledColors];
        } catch (err) {
            // Catch *unexpected* errors outside of the Promise.allSettled
            console.error(err);
        }
    }

    // De-duplicate by color name
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
});
