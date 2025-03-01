import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { onMounted } from 'vue';

// Define scheme type
type ColorScheme = 'light' | 'dark';

export const useThemeStore = defineStore('theme', () => {
    const colorScheme = useStorage<ColorScheme>('color-scheme', 'light');

    // On client-side, set the color-scheme to the preferred user value
    onMounted(() => {
        colorScheme.value = getDefaultColorScheme();

        if (colorScheme.value === 'dark') {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }

        // TODO: Probably a better way to handle this without hiding the entire app until we know the user's color scheme
        document.getElementById('app-container')?.classList.remove('hidden');
    });

    function toggleTheme() {
        document.documentElement.classList.toggle('dark-mode');
        colorScheme.value = getColorScheme();
    }

    return { colorScheme, toggleTheme };
});

function getDefaultColorScheme(): ColorScheme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getColorScheme(): ColorScheme {
    if (typeof document === 'undefined') {
        return 'light';
    }

    const darkModeEnabled = document.documentElement.classList.contains('dark-mode');

    return darkModeEnabled ? 'dark' : 'light';
}
