<template>
  <main>
    <h1>README.site</h1>
    <p>Host your Github README on it's own website. <NuxtLink to="/timb-103">Example</NuxtLink>.</p>

    <form class="notice" @submit.prevent="save()">
      <!-- Username Input-->
      <label>Github Username or Repo:</label>
      <input
        type="text"
        v-model="username"
        placeholder="eg. timb-103 or timb103/nuxt-modal"
        style="width: 350px"
      />

      <!-- Errors-->
      <div v-if="errors">
        <code>{{ errors }}</code>
      </div>

      <!-- Submit Button -->
      <div>
        <button type="submit" :disabled="loading">Create README</button>
      </div>
    </form>

    <!-- How it Works -->
    <details>
      <summary>How it works</summary>
      <p>
        Just enter your github username eg.<code>timb-103</code> or repo eg.<code>
          timb-103/nuxt-modal
        </code>
        into the form above and we'll grab the readme and create it's own page.
      </p>
      <p>
        In fact you don't even need to use the form above. You can just enter it in your browser as
        <code>https://readme.site/timb-103/nuxt-modal</code> and we'll automatically get & save it.
      </p>
    </details>

    <details>
      <summary>How to update your readme.site</summary>
      <p>
        We don't automatically refresh your readme if there's changes, so to update it just enter
        your username in the form above and it will update to your most recent readme.
      </p>
    </details>

    <details>
      <summary>How to create a github readme</summary>
      <p>
        To create a github readme simply create a repo with the same name as your username, then add
        a readme.md file into it.
      </p>
    </details>
  </main>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'README.site' })

const errors = ref('')
const username = ref('')
const loading = ref(false)

async function save() {
  loading.value = true

  // track the event in plausible
  useTrackEvent('save')

  try {
    const response = await $fetch<string>('/api/save', {
      method: 'POST',
      body: {
        username: username.value,
      },
    })

    // change to the readme page
    navigateTo(`/${response}`)
  } catch (error: any) {
    errors.value = 'Error saving. Please check username.'
  }

  loading.value = false
}

useHead({
  meta: [
    { property: 'og:image', content: 'https://301redirect.to/images/og.jpg' },
    { name: 'twitter:image', content: 'https://readme.site/images/og.jpg' },
  ],
})
</script>
