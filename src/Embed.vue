<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Frame from './Frame.vue';

const route = useRoute();

const code = computed(() => {
  return route.query.code
    ? String(route.query.code)
    : null;
});
</script>

<template>
  <Frame :code="code" />
</template>
