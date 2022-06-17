<template>
  <div ref="frame" class="frame" />
</template>

<script>
import { decompress, insertHtml } from './utils';

export default {
  data: () => ({
    code: '',
    observer: null,
    frameBox: { width: 0, height: 0 }
  }),

  watch: {
    '$route': {
      handler: 'process'
    }
  },

  beforeMount() {
    this.$watch('code', this.insert);
    this.$watch('frameBox', this.notify);
    this.$watch('$route', this.process, { immediate: true });
  },

  mounted() {
    this.observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      this.frameBox = { width, height };
    });
    this.observer.observe(this.$refs.frame);
  },

  methods: {
    async process() {
      if (!this.$route.query.code) return;

      this.code = await decompress(this.$route.query.code);
    },

    async insert() {
      await insertHtml(this.$refs.frame, this.code);
    },

    notify() {
      if (window.parent) {
        parent.postMessage(JSON.stringify({type: 'resize', params: this.frameBox}), '*');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.frame {
  width: 100%;
  height: 100%;
  overflow: hidden;

  :deep(img, video, svg, iframe) {
    vertical-align: top;
  }
}
</style>
