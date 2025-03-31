<template>
    <div class="card">
        <Menubar :model="items">
            <template #item="{ item }">
                <NuxtLink
                    :to="item.to"
                    class="no-underline">
                    <i :class="item.icon" />
                    {{ item.label }}
                </NuxtLink>
            </template>
            <template #end>
                <div class="flex items-center gap-2">
                    <ColorSchemeToggle />
                </div>
            </template>
        </Menubar>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ColorSchemeToggle from './ColorSchemeToggle.vue';

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        to: '/',
    },
]);
</script>
