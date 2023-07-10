<script setup lang="ts">
/// <reference types="vite-svg-loader" />

import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '../assets/images/logo.svg?component';
import Github from '../assets/images/github.svg?component';
import i18n from './i18n.json';
import { compress, insertHtml, copyText, onAutoresize } from './utils.js';

const router = useRouter();

const lang = computed(() => {
  const lang = (window.navigator.language || 'en').split('-')[0].toLocaleLowerCase();
  return lang === 'ru' ? 'ru' : 'en';
});

const t = computed(() => {
  return i18n[lang.value];
});

const frame = ref<HTMLElement | null>(null);
const frameBox = ref({ width: 0, height: 0 });
const value = ref('');
const compressed = ref<string|null>(null);

const codeCopied = ref(false);
const autoresizeCopied = ref(false);

const url = computed(() => {
  const route = router.resolve({
    name: 'embed',
    query: { code: compressed.value }
  });

  return window.location.origin + route.fullPath;
});

const code = computed(() => {
  return compressed.value
    ? `<iframe src="${url.value}" height="${frameBox.value.height}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    : ''
});

const autoresize = computed(() => {
  return location.origin + '/lib/autoresize.js';
});
const autoresizeCode = computed(() => {
  const tag = 'script';
  return `<${tag} src="${autoresize.value}" charset="utf-8"></${tag}>`;
});

async function process() {
  compressed.value = await compress(value.value);
  frame.value && insertHtml(frame.value, value.value);
}
async function copyCode() {
  await copyText(code.value);
  codeCopied.value = true;
  setTimeout(() => codeCopied.value = false, 2500);
}
async function copyAutoresize() {
  await copyText(autoresizeCode.value);
  autoresizeCopied.value = true;
  setTimeout(() => autoresizeCopied.value = false, 2500);
}

onBeforeMount(() => {
  window.addEventListener('message', onAutoresize);
});
onBeforeUnmount(() => {
  window.removeEventListener('message', onAutoresize);
});
</script>

<template>
  <div class="main">
    <header class="main__section">
      <div class="main__logo" :title="t.title">
        <Logo class="main__logo" />
      </div>

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

    <section class="main__section" :class="{ 'm_empty': !compressed }">
      <transition enter-from-class="m_hidden" leave-to-class="m_hidden">
        <h2 v-if="compressed" class="main__section_title">
          {{ t.preview }}
        </h2>
      </transition>

      <iframe v-if="compressed" class="main__frame" :src="url" />
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
        <a href="https://github.com/nim579/embeds.works">
          <Github />
          Fork on GitHub
        </a>
      </div>
    </footer>
  </div>
</template>

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

  color: var(--color-primary);

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
      color: var(--color-primary);

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
      color: var(--color-secondary);
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
    color: var(--color-primary);
  }
  &__description {
    display: block;
    margin-top: 36px;
    max-width: 400px;

    font-family: SFRounded, sans-serif;
    font-size: 18px;
    font-weight: 400;
    text-align: center;
    color: var(--color-secondary);
  }

  &__textarea {
    display: block;
    width: 100%;
    min-height: 20px * 5 + 8px * 2 + 2px * 2;
    margin: 0 0 16px 0;
    padding: 8px;
    box-sizing: border-box;

    border: 2px solid var(--color-primary);
    border-radius: 8px;
    background: var(--color-bg);

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
    color: var(--color-primary);

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
    background: var(--color-primary);

    font-family: SFRounded, sans-serif;
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
    text-align: center;
    color: var(--color-bg);

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
    border: 0;
  }

  &__copy {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    border: 2px solid var(--color-primary);
    border-radius: 8px;
    background: var(--color-bg);

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
      color: var(--color-primary);
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
      display: inline-flex;
      align-items: center;
      min-height: 32px;
      margin-right: 16px;

      font-family: SFRounded, sans-serif;
      font-size: 16px;
      font-weight: 400;
      text-decoration: none;
      color: var(--color-primary);

      a {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        gap: 10px;
        color: var(--color-primary);
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
