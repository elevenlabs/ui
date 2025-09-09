import { isAndroidDevice, isIosDevice } from "./compatibility";
import type { DelayConfig } from "./connection";

export async function applyDelay(
  delayConfig: DelayConfig = {
    default: 0,
    // Give the Android AudioManager enough time to switch to the correct audio mode
    android: 3_000,
  }
) {
  let delay = delayConfig.default;
  if (isAndroidDevice()) {
    delay = delayConfig.android ?? delay;
  } else if (isIosDevice()) {
    delay = delayConfig.ios ?? delay;
  }

  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
