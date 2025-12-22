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
      items: [
        {
          label: 'Real-Time Spectrum Analyzer',
          slug: 'equipment/real-time-spectrum-analyzer'
        },
        {
          label: 'Low Noise Block Downconverter',
          slug: 'equipment/low-noise-block-downconverter'
        },
        {
          label: 'GPS Disciplined Oscillator',
          slug: 'equipment/gps-disciplined-oscillator'
        },
        {
          label: 'High Power Amplifier',
          slug: 'equipment/high-power-amplifier'
        },
        {
          label: 'Antenna Control Unit',
          slug: 'equipment/antenna-control-unit'
        },
        {
          label: 'Block Upconverter',
          slug: 'equipment/block-upconverter'
        },
        {
          label: 'Orthomode Transducer',
          slug: 'equipment/orthomode-transducer'
        },
        {
          label: 'IF Filter Bank',
          slug: 'equipment/if-filter-bank'
        },
      ]
    },
    {
      label: 'Scenarios',
      items: [
        {
          label: 'Scenario 1: First Day at NATS',
          slug: 'scenarios/scenario-1'
        },
        {
          label: 'Scenario 2: Scheduled Maintenance',
          slug: 'scenarios/scenario-2'
        },
        {
          label: 'Scenario 3 - Weather Emergency Handover',
          slug: 'scenarios/scenario-3'
        },
        {
          label: 'Scenario 4 - New Bird No Handbook',
          slug: 'scenarios/scenario-4'
        },
        {
          label: 'Scenario 5 - Inclined Orbit Operations',
          slug: 'scenarios/scenario-5'
        },
        {
          label: 'Scenario 6 - Interference Hunt',
          slug: 'scenarios/scenario-6'
        },
        {
          label: 'Scenario 7 - Equipment Cascade',
          slug: 'scenarios/scenario-7'
        },
        {
          label: 'Scenario 8 - First Light Solo',
          slug: 'scenarios/scenario-8'
        },
      ]
      // }, {
      //   label: 'Developer Plugins',
      //   autogenerate: {
      //     directory: 'dev-plugins'
      //   }
    }, {
      label: 'Contributing',
      items: [{
        label: 'Contributing',
        slug: 'contributing/contributing'
      }, {
        label: 'Code of Conduct',
        slug: 'contributing/code-of-conduct'
      }, {
        label: 'License',
        slug: 'contributing/license'
      },
      ]
    }]
  }), mdx()]
});