export declare const stringToBuffer: (str: string) => Uint8Array;
export declare const bufferToString: (buf: Uint8Array) => string;
export declare const stringToBlob: (string: string) => Promise<Blob>;
export declare const bufferToBase64: (arraybuffer: ArrayBuffer) => string;
export declare const base64ToBuffer: (base64string: string) => Uint8Array;
export declare const compress: (string: string) => Promise<string>;
export declare const decompress: (base64string: string) => Promise<string>;
export declare const insertHtml: (el: HTMLElement, html: string) => Promise<void>;
export declare const copyText: (data: string | Promise<string>) => Promise<void>;
export declare const onAutoresize: (event: MessageEvent<any>) => {
    width: number;
    height: number;
} | undefined;
