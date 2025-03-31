<template>
    <DataView
        :value="colors"
        layout="grid"
        data-key="hex">
        <template #grid>
            <div class="flex flex-wrap gap-2 justify-center">
                <div
                    v-for="(data, index) in colors"
                    :key="data.hex || index"
                    class="p-2 flex-shrink-0">
                    <NuxtLink
                        v-if="!loading"
                        :to="`/colors/${data.hex.replace('#', '').toLowerCase()}`">
                        <ColorSwatchCard :color="data" />
                    </NuxtLink>
                    <ColorSwatchCard
                        v-else
                        :color="data"
                        :loading="loading" />
                </div>
            </div>
        </template>
    </DataView>
</template>

<script setup lang="ts">
import type { Color } from '~/server/api/colors/types';
import ColorSwatchCard from '~/components/ColorSwatchCard.vue';

defineProps<{
    colors: Color[];
    loading: boolean;
}>();
</script>
