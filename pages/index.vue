<template>
    <div
        id="index-container"
        class="p-4">
        <h1 class="text-2xl font-bold mb-4">
            {{ $t('colorswatches') }}
        </h1>

        <div class="flex flex-row gap-4 mb-4">
            <div class="flex flex-column gap-4 filter-container pr-5">
                <!-- SATURATION SLIDER -->
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

                <!-- LIGHTNESS SLIDER -->
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

            <!-- STATS -->
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

        <ColorDataView
            :colors="computedColors"
            :loading="loading" />
    </div>
</template>

<script setup lang="ts">
import ColorDataView from '~/components/ColorDataView.vue';
import { useColors } from '~/composables/useColors';

const { colors, getColors, lastRequestCount, lastRequestTime, lastRequestCached } = useColors();
const loading = ref(false);
const { t: $t } = useI18n();

// Saturation and lightness state
const saturation = ref<number>(100);
const lightness = ref<number>(50);

// Debounced fetchColors to optimize performance
const debouncedFetchColors = useDebounceFn(async () => {
    loading.value = true;
    await getColors(saturation.value, lightness.value);
    loading.value = false;
}, 500);

// If loading, display placeholder swatches
const computedColors = computed(() => (loading.value ? Array(45).fill({}) : colors.value));

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
</style>
