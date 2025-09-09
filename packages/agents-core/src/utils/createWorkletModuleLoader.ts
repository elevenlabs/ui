const URLCache = new Map<string, string>();

export function createWorkletModuleLoader(name: string, sourceCode: string) {
  return async (worklet: AudioWorklet) => {
    const url = URLCache.get(name);
    if (url) {
      return worklet.addModule(url);
    }

    const blob = new Blob([sourceCode], { type: "application/javascript" });
    const blobURL = URL.createObjectURL(blob);
    try {
      await worklet.addModule(blobURL);
      URLCache.set(name, blobURL);
      return;
    } catch {
      URL.revokeObjectURL(blobURL);
    }

    try {
      // Attempting to start a conversation in Safari inside an iframe will
      // throw a CORS error because the blob:// protocol is considered
      // cross-origin. In such cases, fall back to using a base64 data URL:
      const base64 = btoa(sourceCode);
      const moduleURL = `data:application/javascript;base64,${base64}`;
      await worklet.addModule(moduleURL);
      URLCache.set(name, moduleURL);
    } catch (error) {
      throw new Error(
        `Failed to load the ${name} worklet module. Make sure the browser supports AudioWorklets.`
      );
    }
  };
}
