<template>
    <div
        id="app-container"
        class="hidden">
        <NavBar />
        <div id="content-container">
            <NuxtPage />
        </div>
    </div>
</template>

<script lang="ts" setup>
import NavBar from '~/components/NavBar.vue';
</script>
