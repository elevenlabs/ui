import type { Preview } from '@storybook/nextjs'
import '../apps/www/styles/globals.css'
import '../apps/www/styles/themes.css'

import React, { useEffect } from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#252525",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Color theme',
      defaultValue: 'default',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'scaled', title: 'Scaled' },
          { value: 'mono', title: 'Mono' },
          { value: 'blue', title: 'Blue' },
          { value: 'green', title: 'Green' },
          { value: 'amber', title: 'Amber' },
          { value: 'rose', title: 'Rose' },
          { value: 'purple', title: 'Purple' },
          { value: 'orange', title: 'Orange' },
          { value: 'teal', title: 'Teal' },
        ],
        dynamicTitle: true,
      },
    },
    darkMode: {
      name: 'Dark Mode',
      description: 'Toggle dark mode',
      defaultValue: 'dark',
      toolbar: {
        icon: 'moon',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story: any, context: any) => {
      const selectedTheme = context.globals.theme || 'default'
      const darkMode = context.globals.darkMode || 'dark'
      
      useEffect(() => {
        // Add/remove dark class on html element
        if (darkMode === 'dark') {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
        
        // Remove all theme classes and add the selected one
        Array.from(document.body.classList)
          .filter((className) => className.startsWith("theme-"))
          .forEach((className) => {
            document.body.classList.remove(className)
          })
        document.body.classList.add(`theme-${selectedTheme}`)
        
        if (selectedTheme === "scaled") {
          document.body.classList.add("theme-scaled")
        }
      }, [darkMode, selectedTheme])
      
      return (
        <div className="theme-container">
          <Story />
        </div>
      )
    },
  ],
};

export default preview;

