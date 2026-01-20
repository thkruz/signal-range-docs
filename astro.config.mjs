import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough', // This is where the setting is used
  }),
  site: 'https://docs.signalrange.space',
  integrations: [starlight({
    prerender: false,
    title: 'Official Documentation',
    description: 'Learn how to start communicating with satellites using SignalRange',
    favicon: './favicon.ico',
    logo: {
      light: '/src/assets/logo-red.png',
      dark: '/src/assets/logo-white.png',
      replacesTitle: true,
    },
    components: {
      TableOfContents: './src/components/TableOfContents.astro',
      PageFrame: './src/components/PageFrame.astro',
      ThemeProvider: './src/components/ThemeProvider.astro',
    },
    social: {
      github: 'https://github.com/thkruz/signal-range-docs',
    },
    customCss: [
      './src/styles/global.css',
    ],
    sidebar: [{
      label: 'Introduction to SignalRange',
      items: [{
        label: 'Overview',
        slug: 'intro/overview'
      },
      ]
    }, {
      label: 'Equipment',
      autogenerate: {
        directory: 'equipment'
      }
    },
    {
      label: 'Campaign 1: North Atlantic Teleport Services',
      items: [
        {
          label: 'Scenario 1: First Day',
          slug: 'campaign-1/scenario-1'
        },
        {
          label: 'Scenario 2: Scheduled Maintenance',
          slug: 'campaign-1/scenario-2'
        },
        {
          label: 'Scenario 3 - Weather Emergency Handover',
          slug: 'campaign-1/scenario-3'
        },
        {
          label: 'Scenario 4 - New Bird No Handbook',
          slug: 'campaign-1/scenario-4'
        },
        {
          label: 'Scenario 5 - Interference Hunt',
          slug: 'campaign-1/scenario-5'
        },
        {
          label: 'Scenario 6 - Old Faithful',
          slug: 'campaign-1/scenario-6'
        },
        {
          label: 'Scenario 7 - Uplink Validation',
          slug: 'campaign-1/scenario-7'
        },
        {
          label: 'Scenario 8 - Night Shift',
          slug: 'campaign-1/debrief'
        }
      ]
      // }, {
      //   label: 'Checklists',
      //   autogenerate: {
      //     directory: 'checklists'
      //   }
    }, {
      label: 'Contributing',
      items: [{
        label: 'Contributing',
        slug: 'contributing/contributing'
      }, {
        label: 'License',
        slug: 'contributing/license'
      },
      ]
    }]
  }), mdx()]
});