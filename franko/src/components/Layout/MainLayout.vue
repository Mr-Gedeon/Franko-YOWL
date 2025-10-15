<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const currentLayout = computed(() => {
    const layoutName = route.meta.layout || 'PublicLayout';
    return defineAsyncComponent(() => import(/* @vite-ignore */`./${layoutName}.vue`));
});
</script>

<template>
    <component :is="currentLayout">
        <router-view></router-view>
    </component>
</template>