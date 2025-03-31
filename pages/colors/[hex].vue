<template>
    <div class="p-4">
        <ColorDataView
            :colors="computedColors"
            :loading="loading" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ColorDataView from '~/components/ColorDataView.vue';
import type { Color } from '~/server/api/colors/types';
import { useColors } from '~/composables/useColors';

const { getColorsByHex } = useColors();

const route = useRoute();
const loading = ref(false);
const colors = ref<Color[]>([]);

const MIN_LOADING_DURATION = 200;

onMounted(async () => {
    loading.value = true;
    const startTime = performance.now();

    try {
        const hex = route.params.hex as string;
        colors.value = await getColorsByHex(hex);
    } catch (err) {
        console.error(err);
    } finally {
        const elapsed = performance.now() - startTime;
        const delay = MIN_LOADING_DURATION - elapsed;
        if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
        loading.value = false;
    }
});

const computedColors = computed(() => (loading.value ? Array(5).fill({}) : colors.value));
</script>
