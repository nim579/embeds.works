<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Frame from './Frame.vue';

const router = useRouter();
const route = useRoute();

const code = computed(() => {
  return route.query.code
    ? String(route.query.code)
    : null;
});

watchEffect(() => {
  if (!route.query.code)
    router.replace({ name: 'main' });
});
</script>

<template>
  <Frame :code="code" />
</template>
