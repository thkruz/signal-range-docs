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
          slug: 'campaign-1/scenario-8'
        }
      ]
      // }, {
      //   label: 'Checklists',
      //   autogenerate: {
      //     directory: 'checklists'
      //   }
    }, {
      label: 'Campaign 2: NATS Europe',
      items: [
        {
          label: 'Scenario 1 - First Light Over Galway',
          slug: 'campaign-2/scenario-1'
        },
        {
          label: 'Scenario 2 - Proving the Link',
          slug: 'campaign-2/scenario-2'
        },
        {
          label: 'Scenario 3 - Two-Way Street',
          slug: 'campaign-2/scenario-3'
        },
        {
          label: 'Scenario 4 - Keys to the Bird',
          slug: 'campaign-2/scenario-4'
        },
        {
          label: 'Scenario 5 - Shetland Comes Online',
          slug: 'campaign-2/scenario-5'
        },
        {
          label: 'Scenario 6 - Watch the Watchers',
          slug: 'campaign-2/scenario-6'
        },
        {
          label: 'Scenario 7 - Moving Target',
          slug: 'campaign-2/scenario-7'
        },
        {
          label: 'Scenario 8 - Night Passes',
          slug: 'campaign-2/scenario-8'
        },
        {
          label: 'Scenario 9 - Morning Constellation',
          slug: 'campaign-2/scenario-9'
        },
        {
          label: 'Scenario 10 - Priority Tasking',
          slug: 'campaign-2/scenario-10'
        },
        {
          label: 'Scenario 11 - LEOP: Launch Day',
          slug: 'campaign-2/scenario-11'
        },
        {
          label: 'Scenario 12 - LEOP: Commissioning',
          slug: 'campaign-2/scenario-12'
        },
        {
          label: "Scenario 13 - The Numbers Don't Lie",
          slug: 'campaign-2/scenario-13'
        },
        {
          label: 'Scenario 14 - Atlantic Low',
          slug: 'campaign-2/scenario-14'
        },
        {
          label: 'Scenario 15 - Rotation Day',
          slug: 'campaign-2/scenario-15'
        },
        {
          label: 'Scenario 16 - Cascade',
          slug: 'campaign-2/scenario-16'
        },
        {
          label: 'Scenario 17 - Unusual Activity',
          slug: 'campaign-2/scenario-17'
        },
        {
          label: 'Scenario 18 - Dirty Spectrum',
          slug: 'campaign-2/scenario-18'
        },
        {
          label: 'Scenario 19 - Frequency Agility',
          slug: 'campaign-2/scenario-19'
        },
        {
          label: 'Scenario 20 - False Time',
          slug: 'campaign-2/scenario-20'
        },
        {
          label: 'Scenario 21 - Knocking on the Door',
          slug: 'campaign-2/scenario-21'
        },
        {
          label: 'Scenario 22 - Connecting the Dots',
          slug: 'campaign-2/scenario-22'
        },
        {
          label: 'Scenario 23 - Dark Passes',
          slug: 'campaign-2/scenario-23'
        },
        {
          label: 'Scenario 24 - North Atlantic Storm',
          slug: 'campaign-2/scenario-24'
        }
      ]
    }, {
      label: 'Campaign 3: Backyard Operator',
      items: [
        {
          label: 'Scenario 1 - First Light',
          slug: 'campaign-3/scenario-1'
        },
        {
          label: 'Scenario 2 - The Slippery Bird',
          slug: 'campaign-3/scenario-2'
        },
        {
          label: 'Scenario 3 - Wrong-Handed',
          slug: 'campaign-3/scenario-3'
        },
        {
          label: 'Scenario 4 - Set and Forget',
          slug: 'campaign-3/scenario-4'
        },
        {
          label: 'Scenario 5 - The Noise Bump',
          slug: 'campaign-3/scenario-5'
        },
        {
          label: 'Scenario 6 - The Network Wants Vermont',
          slug: 'campaign-3/scenario-6'
        },
        {
          label: 'Scenario 7 - Margin Call',
          slug: 'campaign-3/scenario-7'
        },
        {
          label: 'Scenario 8 - Callsign',
          slug: 'campaign-3/scenario-8'
        }
      ]
    }, {
      label: 'Campaign 4: Counter Communications',
      items: [
        {
          label: 'Scenario 2 - Failover',
          slug: 'campaign-4/scenario-2'
        },
        {
          label: 'Scenario 3 - First Shift',
          slug: 'campaign-4/scenario-3'
        },
        {
          label: 'Scenario 4 - State of Health',
          slug: 'campaign-4/scenario-4'
        },
        {
          label: 'Scenario 5 - Ranging Pass',
          slug: 'campaign-4/scenario-5'
        }
      ]
    }, {
      label: 'Campaign 5: Signal Hunter',
      items: [
        {
          label: 'Scenario 1 - First Fix',
          slug: 'campaign-5/scenario-1'
        },
        {
          label: 'Scenario 2 - Two Carriers',
          slug: 'campaign-5/scenario-2'
        },
        {
          label: 'Scenario 3 - Cold Trail',
          slug: 'campaign-5/scenario-3'
        },
        {
          label: 'Scenario 4 - Prove It',
          slug: 'campaign-5/scenario-4'
        }
      ]
    }, {
      label: 'Contributing',
      items: [{
        label: 'Contributing',
        slug: 'contributing/contributing'
      }, {
        label: 'License',
        slug: 'contributing/license'
      },
      {
        label: 'Writing a Plugin',
        slug: 'contributing/plugins'
      },
      ]
    }]
  }), mdx()]
});