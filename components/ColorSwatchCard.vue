<template>
    <Card class="shadow-4 color-swatch">
        <template #content>
            <div class="flex flex-column align-items-center">
                <template v-if="loading">
                    <Skeleton
                        width="100px"
                        height="100px"
                        class="mb-2 border-solid border-1" />
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
                        class="color-swatch__color border-round border-solid border-1"
                        :style="{ backgroundColor: color.hex }" />
                    <div class="color-swatch__info w-full mt-2 text-center">
                        <p
                            :title="color.name"
                            class="text-sm font-semibold overflow-hidden text-overflow-ellipsis white-space-nowrap m-0">
                            {{ color.name }}
                        </p>
                        <p
                            class="text-sm text-gray-500 overflow-hidden text-overflow-ellipsis white-space-nowrap m-0">
                            {{ formatRGB(color.rgb) }}
                        </p>
                    </div>
                </template>
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import type { Color, RGB } from '~/services/colors/types';

defineProps({
    color: {
        type: Object as () => Color,
        required: true,
    },
    loading: {
        type: Boolean,
        default: false,
    },
});

const { t: $t } = useI18n();

const formatRGB = (rgb: RGB) => {
    return `${$t('rgb')}(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};
</script>

<style lang="scss" scoped>
.color-swatch {
    width: 200px;

    .color-swatch__color {
        height: 100px;
        width: 100px;
    }
}
</style>
