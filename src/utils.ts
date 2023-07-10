import * as brotli from 'brotli-compress';
import type { ResizeMessage } from './Frame.vue';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const lookup = new Uint8Array(256);

for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

export const stringToBuffer = (str: string) => Uint8Array.from(String(str).split('').map(char => char.charCodeAt(0)));

export const bufferToString = (buf: Uint8Array) => String.fromCharCode.apply(null, Array.from(buf));

export const stringToBlob = (string: string) => fetch(`data:text/plain,${string}`).then(req => req.blob());

export const bufferToBase64 = (arraybuffer: ArrayBuffer) => {
  if (typeof arraybuffer === 'string') return arraybuffer;

  const bytes = new Uint8Array(arraybuffer);
  const len = bytes.length;
  let base64url = '';

  for (let i = 0; i < len; i += 3) {
    base64url += chars[bytes[i] >> 2];
    base64url += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64url += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64url += chars[bytes[i + 2] & 63];
  }

  if ((len % 3) === 2) {
    base64url = base64url.substring(0, base64url.length - 1);
  } else if (len % 3 === 1) {
    base64url = base64url.substring(0, base64url.length - 2);
  }

  return base64url;
};

export const base64ToBuffer = (base64string: string) => {
  if (typeof base64string !== 'string') return base64string;

  const bufferLength = base64string.length * 0.75;
  const len = base64string.length;
  let p = 0;

  const bytes = new Uint8Array(bufferLength);

  for (let i = 0; i < len; i += 4) {
    const encoded1 = lookup[base64string.charCodeAt(i)];
    const encoded2 = lookup[base64string.charCodeAt(i + 1)];
    const encoded3 = lookup[base64string.charCodeAt(i + 2)];
    const encoded4 = lookup[base64string.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return bytes;
};

export const compress = async (string: string) => {
  const buf = await brotli.compress(stringToBuffer(string));
  return bufferToBase64(buf);
};
export const decompress = async (base64string: string) => {
  const buf = await brotli.decompress(base64ToBuffer(base64string));
  return bufferToString(buf);
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
  }
};
