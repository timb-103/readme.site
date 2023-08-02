<template>
  <main v-if="data">
    <!-- Avatar -->
    <img
      class="avatar"
      :src="`https://github.com/${data.username}.png?size=100`"
      width="50"
      height="50"
    />

    <!-- Markdown -->
    <ContentRenderer :value="{ data: data.content }">
      <ContentRendererMarkdown :value="data.content" />
    </ContentRenderer>
  </main>
</template>

<script setup lang="ts">
import type { Readme } from '@/types/readme'

// @ts-ignore
import { transformContent } from '@nuxt/content/transformers/index'

useSeoMeta({ title: 'README.site' })

const { data } = await useAsyncData('username', async () => {
  const readme = await $fetch<Readme>('/api/get', {
    method: 'POST',
    body: {
      username: useRoute().params.username,
    },
  })

  // transform to @nuxt/content format and return it
  const content = await transformContent(`content:${readme.username}.md`, readme.markdown)

  return {
    content,
    username: readme.username,
  }
})
</script>

<style scoped>
.avatar {
  border-radius: 50%;
  background: #fafafa;
}
main:deep(hr) {
  height: 3px;
}
</style>
