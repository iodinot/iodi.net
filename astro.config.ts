import { rehypeHeadingIds } from '@astrojs/markdown-remark'

import cloudflare from '@astrojs/cloudflare'
import AstroPureIntegration from 'astro-pure'
import { defineConfig } from 'astro/config'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

// Local integrations
import { remarkAside } from './src/plugins/remark-aside.ts'
// Local rehype & remark plugins
import rehypeAutolinkHeadings from './src/plugins/rehype-auto-link-headings.ts'
// Shiki
import {
  addCopyButton,
  addLanguage,
  addTitle,
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
  transformerNotationErrorLevel,
  updateStyle
} from './src/plugins/shiki-transformers.ts'
import config from './src/site.config.ts'
import remarkDirective from 'remark-directive'

// https://astro.build/config
export default defineConfig({
  // Top-Level Options
  site: 'https://iodi.net',
  // Deploy to a sub path; See https://astro-pure.js.org/docs/setup/deployment#platform-with-base-path
  // base: '/astro-pure/',
  trailingSlash: 'never',

  // Adapter
  // https://docs.astro.build/en/guides/deploy/
  // 1. Vercel (serverless)
  // adapter: vercel(),
  // output: 'server',
  // 2. Vercel (static)
  // adapter: vercelStatic(),
  // 3. Cloudflare
  adapter: cloudflare(),
  // ---

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        imageService: 'compile'
      }
    }
  },

  integrations: [
    // astro-pure will automatically add sitemap, mdx & unocss
    // sitemap(),
    // mdx(),
    AstroPureIntegration(config)
    // @playform/compress have potential build issue with this template
    // (await import('@playform/compress')).default({ SVG: false, Exclude: ['index.*.js'] })

    // Temporary fix vercel adapter
    // static build method is not needed
  ],
  // root: './my-project-directory',

  // Prefetch Options
  prefetch: true,
  // Server Options
  server: {
    host: true
  },
  // Markdown Options
  markdown: {
    remarkPlugins: [remarkDirective, remarkAside, remarkMath],
    rehypePlugins: [
      [rehypeKatex, {}],
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: { className: ['anchor'] },
          content: { type: 'text', value: '#' }
        }
      ]
    ],
    // https://docs.astro.build/en/guides/syntax-highlighting/
    shikiConfig: {
      themes: {
        light: 'light-plus',
        dark: 'dark-plus'
      },
      transformers: [
        transformerNotationDiff() as any,
        transformerNotationHighlight() as any,
        transformerNotationFocus() as any,
        transformerNotationErrorLevel() as any,
        updateStyle(),
        addTitle(),
        addLanguage(),
        addCopyButton(2000)
      ]
    }
  },
  experimental: {
    contentIntellisense: true
  },
  vite: {
    optimizeDeps: {
      exclude: ['astro-pure']
    }
  }
})
