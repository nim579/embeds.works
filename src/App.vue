<template>
  <router-view />
</template>

<script>
export default {};
</script>

<style lang="scss">
@use './styles';

html,
body {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
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
