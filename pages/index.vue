<template>
    <div
        id="index-container"
        class="p-2">
        <h1>{{ $t('helloworld') }}</h1>
    </div>
</template>

<script setup lang="ts">
const { t: $t } = useI18n();

useHead({
    titleTemplate: (titleChunk) => {
        return `${titleChunk} - ${$t('helloworld')}`;
    },
});
</script>
