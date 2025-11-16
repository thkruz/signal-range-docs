import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
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
          label: 'Scenario 1: HELIOS-7 Initial Contact',
          slug: 'scenarios/scenario-1'
        }
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