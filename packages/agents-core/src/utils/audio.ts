export function arrayBufferToBase64(b: ArrayBufferLike) {
  const buffer = new Uint8Array(b);
  // @ts-ignore
  const base64Data = window.btoa(String.fromCharCode(...buffer));
  return base64Data;
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
