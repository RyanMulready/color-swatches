import type { ColorApiResponse, Color } from './types';

export function mapColorApiResponseToColor(apiResponse: ColorApiResponse): Color {
    return {
        name: apiResponse.name.value,
        rgb: {
            r: apiResponse.rgb.r,
            g: apiResponse.rgb.g,
            b: apiResponse.rgb.b,
        },
        hex: apiResponse.hex.value,
    };
}
