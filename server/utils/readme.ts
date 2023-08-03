import type { GitHubRepository } from '@/types/github'

export async function saveReadme(username: string): Promise<string | null> {
  const db = mongo.db()

  console.log(`Saving readme for ${username}.`)

  try {
    // remove whitespace & caps
    username = username.replace(/\s/g, '').toLowerCase()

    // get the default branch
    const repo = await getGithubRepo(username)

    if (!repo) {
      return null
    }

    // get the raw README.MD content
    const markdown = await $fetch<string>(
      `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/README.md`
    )

    // return error if none found
    if (!markdown) {
      return null
    }

    // add/update the readme content in db
    await db.collection('Readmes').updateOne(
      { username },
      {
        $setOnInsert: { created: new Date(), views: 0 },
        $set: {
          repo,
          markdown,
          updated: new Date(),
        },
      },
      { upsert: true }
    )

    // return success
    return username
  } catch (error) {
    console.log('Error saving readme:', error)
  }

  return null
}

export async function getGithubRepo(username: string): Promise<GitHubRepository | null> {
  // if it's a username only, we must add it again to the url like timb-103/timb-103
  if (!username.includes('/')) {
    username += `/${username}`
  }

  try {
    // get the repo via githubs open api
    return await $fetch<GitHubRepository>(`https://api.github.com/repos/${username}`)
  } catch (error) {
    console.log('Error getting github owner:', error)
  }

  return null
}
