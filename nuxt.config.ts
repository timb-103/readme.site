export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },
  modules: ['nuxt-simple-css', '@nuxt/content', '@nuxtjs/plausible', 'nuxt-mongodb'],
  plausible: {
    domain: 'readme.site',
  },
  nuxtSimpleCSS: {
    accent: '#0969da',
    border: '#d0d7de',
  },
  content: {
    markdown: {
      anchorLinks: false,
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'description',
          content: "Host your Github README on it's own website.",
        },
        { property: 'title', content: 'README.site' },
        {
          property: 'description',
          content: "Host your Github README on it's own website.",
        },
        { property: 'og:title', content: 'README.site' },

        { property: 'og:image:alt', content: 'README.site' },
        {
          property: 'og:description',
          content: "Host your Github README on it's own website.",
        },
        { property: 'og:url', content: 'https://readme.site/images/og.jpg' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:title', content: 'README.site' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@timb03' },
        {
          name: 'twitter:description',
          content: "Host your Github README on it's own website.",
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>📑</text></svg>',
        },
      ],
    },
  },
})
