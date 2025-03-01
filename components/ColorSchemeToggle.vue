<template>
    <Button
        :icon="themeIcon"
        class="capitalize"
        variant="outlined"
        @click="themeStore.toggleTheme()" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useThemeStore } from '~/store/theme';

const themeStore = useThemeStore();
const themeIcon = computed(() => (themeStore.colorScheme === 'dark' ? 'pi pi-moon' : 'pi pi-sun'));
</script>
