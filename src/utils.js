import * as brotli from 'brotli-compress';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

let lookup = new Uint8Array(256);

for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

export const stringToBuffer = str => Uint8Array.from(String(str).split('').map(char => char.charCodeAt(0)));

export const bufferToString = buf => String.fromCharCode.apply(null, buf);

export const stringToBlob = (string) => fetch(`data:text/plain,${string}`).then(req => req.blob());

export const bufferToBase64 = (arraybuffer) => {
  if (typeof arraybuffer === 'string') return arraybuffer;

  let bytes = new Uint8Array(arraybuffer),
    i, len = bytes.length, base64url = '';

  for (i = 0; i < len; i += 3) {
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

export const base64ToBuffer = (base64string) => {
  if (typeof base64string !== 'string') return base64string;

  let bufferLength = base64string.length * 0.75,
    len = base64string.length, i, p = 0,
    encoded1, encoded2, encoded3, encoded4;

  let bytes = new Uint8Array(bufferLength);

  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64string.charCodeAt(i)];
    encoded2 = lookup[base64string.charCodeAt(i + 1)];
    encoded3 = lookup[base64string.charCodeAt(i + 2)];
    encoded4 = lookup[base64string.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return bytes;
};

export const compress = async (string) => {
  const buf = await brotli.compress(stringToBuffer(string));
  return bufferToBase64(buf);
};
export const decompress = async (base64string) => {
  const buf = await brotli.decompress(base64ToBuffer(base64string));
  return bufferToString(buf);
};

/**
 *
 * @param {HTMLElement} el
 * @param {string} html
 */
export const insertHtml = async (el, html) => {
  el.innerHTML = '';
  el.innerHTML = html;

  const scripts = Array.from(el.querySelectorAll('script'));

  for (let script of scripts) {
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
};

export const copyText = async (data) => {
  if (typeof window.ClipboardItem !== 'undefined') {
    const blob = data instanceof Promise
      ? data.then(stringToBlob)
      : stringToBlob(data);

    const item = new window.ClipboardItem({ 'text/plain': blob });

    return navigator.clipboard.write([item]);
  } else {
    const text = data instanceof Promise ? await data : data;
    return navigator.clipboard.writeText(text);
  }
};
