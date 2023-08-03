<template>
  <main v-if="data">
    <!-- Avatar -->
    <img
      v-if="showAvatar"
      class="avatar"
      :alt="`${data.username}'s' avatar`"
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
import { GitHubRepository } from 'types/github'

const props = defineProps<{
  showAvatar: boolean
}>()

useSeoMeta({ title: 'README.site' })

const { data } = await useAsyncData('username', async () => {
  let { username, repo } = useRoute().params

  if (repo) {
    username += `/${repo}`
  }

  const readme = await $fetch<Readme>('/api/get', {
    method: 'POST',
    body: {
      username,
    },
  })

  // replace relative paths for .github assets
  const replacedString = replaceRelativePaths(readme.repo, readme.markdown)

  // transform to @nuxt/content format and return it
  const content = await transformContent(`content:${readme.username}.md`, replacedString)

  console.log('content:', content)

  return {
    content,
    username: readme.username,
  }
})

function replaceRelativePaths(repo: GitHubRepository, largerString: string): string {
  // Regular expression to match the relative paths
  const regex = /(\.\/\.github\/([\w-\/.]+))/g

  // Replace the matched relative paths with the desired URL format
  const replacedString = largerString.replace(regex, (match, path) => {
    const urlPath = path.replace('./.github/', '.github/')
    return `https://github.com/${repo.full_name}/blob/${repo.default_branch}/${urlPath}?raw=true`
  })

  return replacedString
}

// add a dynamic og image
const ogURL = 'https://dynamic-og-image-generator.vercel.app/api/generate'
useHead({
  meta: [
    {
      property: 'og:image',
      content: `${ogURL}?title=${data.value?.username}%27s+README.&author=README.site&theme=github`,
    },
    {
      property: 'twitter:image',
      content: `${ogURL}?title=${data.value?.username}%27s+README.&author=README.site&theme=github`,
    },
  ],
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
main:deep(pre) {
  background-color: var(--text);
}
main:deep(code:not(pre code)) {
  background-color: var(--accent-bg);
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  border-radius: 6px;
}
main:deep(table) {
  width: 100%;
}
</style>
