<template>
  <div class="main">
    <header class="main__section">
      <Logo class="main__logo" :title="t.title" />
      <div class="main__description">
        {{ t.description }}
      </div>
    </header>

    <form class="main__section" @submit.prevent="process">
      <textarea v-model="value" :placeholder="t.value" class="main__textarea" />
      <button type="submit" class="main__button" :disabled="!value">
        {{ t.convert }}
      </button>
    </form>

    <transition enter-from-class="m_hidden" leave-to-class="m_hidden">
      <section v-if="code" class="main__section">
        <textarea :value="code" class="main__textarea" readonly />
        <button type="button" class="main__button" @click.prevent="copyCode">
          <span v-if="!codeCopied">{{ t.result }}</span>
          <span v-else>{{ t.copied }}</span>
        </button>
      </section>
    </transition>

    <section class="main__section" :class="{'m_empty': !compressed}">
      <transition enter-from-class="m_hidden" leave-to-class="m_hidden">
        <h2 v-if="compressed" class="main__section_title">
          {{ t.preview }}
        </h2>
      </transition>

      <div ref="frame" class="main__frame" />
    </section>

    <section class="main__section">
      <h2 class="main__section_title">
        {{ t.autoresize.title }}
      </h2>
      <div class="main__section_text">
        {{ t.autoresize.description }}
      </div>

      <fieldset class="main__copy">
        <input type="text" :value="autoresizeCode" readonly class="main__copy_input">
        <div class="main__copy_action">
          <button class="main__button" @click.prevent="copyAutoresize">
            <span v-if="!autoresizeCopied">{{ t.autoresize.copy }}</span>
            <span v-else>{{ t.copied }}</span>
          </button>
        </div>
      </fieldset>
    </section>

    <footer class="main__footer">
      <div class="main__footer_item">
        <a href="https://nick-iv.me/">
          © Nick Iv, {{ new Date().getFullYear() }}
        </a>
      </div>
      <div class="main__footer_item">
        <a href="https://github.com/nim579/embed.works">
          Fork on GitHub
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import Logo from '../assets/images/logo.svg?component';
import i18n from './i18n.json';
import { compress, insertHtml, copyText } from './utils';

export default {
  components: { Logo },

  data() {
    return {
      value: '',
      compressed: '',
      observer: null,
      codeCopied: false,
      autoresizeCopied: false,
      frameBox: { width: 0, height: 0 }
    };
  },

  computed: {
    lang() {
      const lang = (window.navigator.language || 'en').split('-')[0].toLocaleLowerCase();
      return lang === 'ru' ? 'ru' : 'en';
    },

    t() {
      return i18n[this.lang];
    },

    url() {
      if (!this.compressed) return '';

      const route = this.$router.resolve({
        name: 'embed',
        query: { code: this.compressed }
      });

      return location.origin + route.fullPath;
    },
    code() {
      if (!this.url) return '';
      return `<iframe src="${this.url}" height="${this.frameBox.height}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    },

    autoresize() {
      return location.origin + '/lib/autoresize.js';
    },

    autoresizeCode() {
      const tag = 'script';
      return `<${tag} src="${this.autoresize}" charset="utf-8"></${tag}>`;
    }
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
      this.compressed = await compress(this.value);
      insertHtml(this.$refs.frame, this.value);
    },

    async copyCode() {
      await copyText(this.code);
      this.codeCopied = true;
      setTimeout(() => this.codeCopied = false, 2500);
    },

    async copyAutoresize() {
      await copyText(this.autoresizeCode);
      this.autoresizeCopied = true;
      setTimeout(() => this.autoresizeCopied = false, 2500);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  max-width: 700px + 20px * 2;
  margin: 0 auto;
  padding: 36px 20px;
  box-sizing: border-box;

  font-family: SFRounded, sans-serif;
  font-weight: normal;

  color: #1A1919;

  &__section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 80px;

    transition: opacity 0.2s, transform 0.2s;

    &_title {
      display: block;
      margin: 0 0 8px 0;

      font-family: SFRounded, sans-serif;
      font-size: 26px;
      font-weight: 600;
      text-align: center;
      color: #1A1919;

      transition: opacity 0.2s, transform 0.2s;

      &.m_hidden {
        opacity: 0;
        transform: translateY(-8px);
      }
    }
    &_text {
      display: block;
      margin: 0 0 24px 0;

      font-family: SFRounded, sans-serif;
      font-size: 18px;
      font-weight: 400;
      text-align: center;
      color: #707070;
    }

    &.m_empty, &:last-child {
      margin-bottom: 0;
    }

    &.m_hidden {
      opacity: 0;
      transform: translateY(-8px);
    }
  }

  &__logo {
    color: #1A1919;
  }
  &__description {
    display: block;
    margin-top: 36px;
    max-width: 400px;

    font-family: SFRounded, sans-serif;
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    color: #707070;
  }

  &__textarea {
    display: block;
    width: 100%;
    min-height: 20px * 5 + 8px * 2 + 2px * 2;
    margin: 0 0 16px 0;
    padding: 8px;
    box-sizing: border-box;

    border: 2px solid #1A1919;
    border-radius: 8px;
    background: #FFFFFF;

    outline: 0;
    box-shadow: none;

    font-family: ui-monospace,
      SFMono-Regular,
      SF Mono,
      Menlo,
      Consolas,
      Liberation Mono,
      monospace;
    font-size: 16px;
    line-height: 20px;
    font-weight: normal;
    text-align: left;
    color: #1A1919;

    &:last-child {
      margin-bottom: 0;
    }
    &:read-only {
      background: #F6F5F5;
    }
  }
  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    margin: 0;
    padding: 8px 16px;
    border: 0;
    border-radius: 8px;
    background: #1A1919;

    font-family: SFRounded, sans-serif;
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
    text-align: center;
    color: #FFFFFF;

    cursor: pointer;
    transition: all 0.4s;

    &:disabled {
      opacity: 0.3;
    }
  }

  &__frame {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &__copy {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    border: 2px solid #1A1919;
    border-radius: 8px;
    background: #FFFFFF;

    &_input {
      flex: 1 1 auto;
      width: 100%;

      padding: 6px;
      border: 0;
      outline: 0;
      background: transparent;

      box-shadow: none;

      font-family: ui-monospace,
        SFMono-Regular,
        SF Mono,
        Menlo,
        Consolas,
        Liberation Mono,
        monospace;
      font-size: 16px;
      line-height: 20px;
      font-weight: normal;
      text-align: left;
      color: #1A1919;
    }
    &_action {
      flex: 0 0 auto;
      margin: -2px -2px -2px 0;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;

    &_item {
      display: inline-block;
      margin-right: 16px;

      font-family: SFRounded, sans-serif;
      font-size: 16px;
      font-weight: 400;
      text-decoration: none;
      color: #1A1919;

      a {
        text-decoration: none;
        color: #1A1919;
      }

      &::after {
        content: "•";
        display: inline-block;
        padding-left: 16px;
      }

      &:last-child {
        margin-right: 0;

        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
