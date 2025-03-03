import type { Color } from '~/services/colors/types';

export const DEFAULT_SATURATION = 100;
export const DEFAULT_LIGHTNESS = 50;

export const COLOR_BLACK: Color = { name: 'Black', rgb: { r: 0, g: 0, b: 0 }, hex: '#000000' };
export const COLOR_WHITE: Color = {
    name: 'White',
    rgb: { r: 255, g: 255, b: 255 },
    hex: '#ffffff',
};
