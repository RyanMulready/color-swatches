<template>
    <div
        id="index-container"
        class="p-4">
        <h1 class="text-2xl font-bold mb-4">
            {{ $t('colorswatches') }}
        </h1>

        <div class="flex flex-row gap-4 mb-4">
            <div class="flex flex-column gap-4 filter-container pr-5">
                <div class="flex flex-column">
                    <label
                        for="saturation-slider"
                        class="font-semibold">
                        {{ $t('saturation') }}: {{ saturation }}%
                    </label>
                    <Slider
                        v-model="saturation"
                        :disabled="loading"
                        :min="0"
                        :max="100"
                        @slideend="debouncedFetchColors" />
                </div>

                <div class="flex flex-column">
                    <label
                        for="lightness-slider"
                        class="font-semibold">
                        {{ $t('lightness') }}: {{ lightness }}%
                    </label>
                    <Slider
                        v-model="lightness"
                        :min="0"
                        :max="100"
                        :disabled="loading"
                        @slideend="debouncedFetchColors" />
                </div>
            </div>
            <div class="flex flex-column gap-2 stats-container">
                <h2 class="m-0 mb-2">
                    {{ $t('stats') }}
                </h2>
                <div class="flex flex-row justify-content-between">
                    <span>{{ $t('requests') }}:</span>
                    <span>{{ lastRequestCount }} ({{ lastRequestTime }})</span>
                </div>
                <div class="flex flex-row justify-content-between">
                    <span>{{ $t('colors') }}:</span>
                    <span>{{ colors.length }}</span>
                </div>
                <div class="flex flex-row justify-content-between">
                    <span>{{ $t('cached') }}:</span>
                    <span>{{ lastRequestCached }}</span>
                </div>
            </div>
        </div>

        <DataView
            :value="computedColors"
            layout="grid"
            data-key="hex">
            <template #grid>
                <div class="flex flex-wrap gap-2 justify-center">
                    <div
                        v-for="(data, index) in computedColors"
                        :key="data.hex || index"
                        class="p-2 flex-shrink-0 color-swatch">
                        <Card class="shadow-4">
                            <template #content>
                                <div class="flex flex-column align-items-center">
                                    <template v-if="loading">
                                        <Skeleton
                                            width="100px"
                                            height="100px"
                                            class="mb-2" />
                                        <Skeleton
                                            width="100%"
                                            height="1rem"
                                            class="mb-1" />
                                        <Skeleton
                                            width="100%"
                                            height="1rem" />
                                    </template>
                                    <template v-else>
                                        <div
                                            class="color-swatch__color border-round"
                                            :style="{ backgroundColor: data.hex }" />
                                        <div class="color-swatch__info w-full mt-2 text-center">
                                            <p
                                                :title="data.name"
                                                class="text-sm font-semibold overflow-hidden text-overflow-ellipsis white-space-nowrap m-0">
                                                {{ data.name }}
                                            </p>
                                            <p
                                                class="text-sm text-gray-500 overflow-hidden text-overflow-ellipsis white-space-nowrap m-0">
                                                {{ formatRGB(data.rgb) }}
                                            </p>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>

<script setup lang="ts">
import { useColors } from '~/composables/useColors';
import type { RGB } from '~/services/colors/types';

const { colors, fetchColors, lastRequestCount, lastRequestTime, lastRequestCached } = useColors();
const loading = ref(false);
const { t: $t } = useI18n();

// Saturation and lightness state
const saturation = ref<number>(100);
const lightness = ref<number>(50);

// Debounced fetchColors to optimize performance
const debouncedFetchColors = useDebounceFn(async () => {
    loading.value = true;
    await fetchColors(saturation.value, lightness.value);
    loading.value = false;
}, 500);

const computedColors = computed(() => (loading.value ? Array(45).fill({}) : colors.value));

const formatRGB = (rgb: RGB) => {
    return `${$t('rgb')}(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

useHead({
    titleTemplate: (titleChunk) => `${titleChunk} - ${$t('colorswatches')}`,
});
</script>

<style lang="scss" scoped>
.filter-container {
    width: 300px;
}

.stats-container {
    width: 175px;
}

.color-swatch {
    width: 175px;

    .color-swatch__color {
        height: 100px;
        width: 100px;
    }
}
</style>
