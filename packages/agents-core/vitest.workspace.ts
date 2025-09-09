/// <reference types="@vitest/browser/providers/playwright" />

import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      name: "Browser tests",
      browser: {
        provider: "playwright",
        enabled: true,
        instances: [
          {
            browser: "chromium",
            launch: {
              args: [
                "--use-fake-device-for-media-stream",
                "--use-fake-ui-for-media-stream",
              ],
            },
            context: {
              permissions: ["microphone"],
            },
          },
          {
            browser: "firefox",
            headless: true,
            launch: {
              firefoxUserPrefs: {
                "permissions.default.microphone": 1,
                "media.navigator.streams.fake": true,
                "media.navigator.permission.disabled": true,
              },
            },
          },
        ],
      },
    },
  },
]);
