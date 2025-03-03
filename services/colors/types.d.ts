export type RGB = {
    r: number;
    g: number;
    b: number;
};

export type HSL = {
    h: number;
    s: number;
    l: number;
};

export type HSV = {
    h: number;
    s: number;
    v: number;
};

export type CMYK = {
    c: number;
    m: number;
    y: number;
    k: number;
};

export type XYZ = {
    X: number;
    Y: number;
    Z: number;
};

export type APIValue<T> = {
    value: string;
    fraction: T;
};

export type Fractional<T> = {
    fraction: T;
} & T;

export interface ColorApiResponse {
    hex: {
        value: string;
        clean: string;
    };
    rgb: Fractional<RGB> & { value: string };
    hsl: Fractional<HSL> & { value: string };
    hsv: Fractional<HSV> & { value: string };
    cmyk: Fractional<CMYK> & { value: string };
    XYZ: Fractional<XYZ> & { value: string };
    name: {
        value: string;
        closest_named_hex: string;
        exact_match_name: boolean;
        distance: number;
    };
    image: {
        bare: string;
        named: string;
    };
    contrast: {
        value: string;
    };
    _links: {
        self: {
            href: string;
        };
    };
    _embedded: Record<string, unknown>;
}

/**
 * Simplified Color Model for frontend usage
 */
export interface Color {
    name: string;
    rgb: RGB;
    hex: string;
}
