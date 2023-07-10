<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style lang="scss">
@use './styles';

html,
body {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  background: var(--color-bg);
  color: var(--color-primary);
}

body {
  position: relative;
  -webkit-tap-highlight-color: fade-out(white, 1);
  -webkit-tap-highlight-color: fade-out(white, 1);
  -webkit-focus-ring-color: fade-out(white, 1);
  -webkit-text-size-adjust: none;
  outline: none;
}

img {
  border: 0;
  vertical-align: top;
}

#app {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
