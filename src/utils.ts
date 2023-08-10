import * as brotli from 'brotli-compress';
import type { ResizeMessage } from './Frame.vue';

export const stringToBlob = (string: string) => fetch(`data:text/plain,${string}`).then(req => req.blob());

export const bufferToBase64 = (arraybuffer: ArrayBuffer) => {
  if (typeof arraybuffer === 'string') return arraybuffer;

  let binary = '';
  const bytes = new Uint8Array(arraybuffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
};

export const base64ToBuffer = (base64string: string) => {
  if (typeof base64string !== 'string') return base64string;

  const binaryString = window.atob(base64string);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const compress = async (string: string) => {
  const encoder = new TextEncoder();
  const buf = await brotli.compress(encoder.encode(string));
  return bufferToBase64(buf);
};
export const decompress = async (base64string: string) => {
  const buf = await brotli.decompress(base64ToBuffer(base64string));
  const decoder = new TextDecoder();
  return decoder.decode(buf);
};


export const insertHtml = async (el: HTMLElement, html: string) => {
  el.innerHTML = '';
  el.innerHTML = html;

  const scripts = Array.from(el.querySelectorAll('script'));

  for (const script of scripts) {
    const clone = document.createElement('script');

    clone.text = script.innerHTML;

    Array.from(script.attributes).forEach(attr => {
      clone.setAttribute(attr.name, attr.value);
    });

    await new Promise(resolve => {
      clone.onload = resolve;
      el.replaceChild(clone, script);
    });
  }

  setTimeout(() => document.dispatchEvent(new Event('DOMContentLoaded')));
};

export const copyText = async (data: string|Promise<string>) => {
  if (typeof window.ClipboardItem !== 'undefined') {
    const blob = stringToBlob(await data);

    const item = new window.ClipboardItem({ 'text/plain': blob });

    return navigator.clipboard.write([item]);
  } else {
    return navigator.clipboard.writeText(await data);
  }
};

export const onAutoresize = (event: MessageEvent<any>) => {
  if (event.origin === import.meta.env.APP_URL) {
    const data: ResizeMessage = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

    document.querySelectorAll('iframe').forEach(iframe => {
      if (iframe.contentWindow === event.source) {
        iframe.style.height = `${data.params.height}px`;
      }
    });

    return data.params;
  }
};
