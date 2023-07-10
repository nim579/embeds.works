<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';
import { decompress, insertHtml } from './utils.js';

export type ResizeMessage = {
  type: 'resize',
  params: {
    width: number;
    height: number;
  };
};

const props = defineProps<{
  code: string|null;
}>();

const frame = ref<HTMLElement | null>(null);
const frameBox = ref({ width: 0, height: 0 });
const observer = ref<ResizeObserver | null>(null);

watchEffect(async () => {
  if (!props.code) return;
  if (!frame.value) return;

  const code = await decompress(String(props.code));
  await insertHtml(frame.value, code);
});

watchEffect(() => {
  if (observer.value) {
    observer.value.disconnect();
  }

  if (frame.value) {
    observer.value = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      frameBox.value = { width, height };
    })
    observer.value.observe(frame.value);
  }
});

watch(frameBox, () => {
  notify();
});

function notify() {
  if (window.parent) {
    parent.postMessage(JSON.stringify({ type: 'resize', params: frameBox.value } as ResizeMessage), '*');
  }
}
</script>

<template>
  <div ref="frame" class="frame" />
</template>


<style lang="scss" scoped>
.frame {
  width: 100%;
  height: 100%;
  overflow: hidden;
  vertical-align: top;

  :deep(img, video, svg, iframe) {
    vertical-align: top;
  }
}
</style>
