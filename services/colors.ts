export async function fetchUniqueColors(saturation: number, lightness: number) {
    const response = await $fetch('/api/colors', {
        query: { saturation, lightness },
    });

    return response;
}

export async function fetchColorByHex(hex: string) {
    const response = await $fetch(`/api/colors/${hex}`);

    return response;
}
