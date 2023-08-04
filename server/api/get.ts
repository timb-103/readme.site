import type { Readme } from '@/types/readme'
import { mongo } from '#mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = mongo.db()

  console.log(`Getting readme for ${body.username}.`)

  try {
    // remove whitespace & caps
    const username = body.username.replace(/\s/g, '').toLowerCase()

    // get readme content from db
    let readme = await db.collection<Readme>('Readmes').findOne({ username })

    // if no readme, try and create one
    if (!readme?.repo) {
      if (await saveReadme(username)) {
        readme = await db.collection<Readme>('Readmes').findOne({ username })
      }
    }

    // if still none found, return
    if (!readme) {
      return createError({
        statusCode: 400,
        statusMessage: 'Error getting readme, please check your username.',
      })
    }

    // increment views count
    db.collection('Readmes').updateOne({ username }, { $inc: { views: 1 } })

    return readme
  } catch (error) {
    console.log('Error getting readme:', error)
  }

  // return an error
  throw createError({
    statusCode: 400,
    statusMessage: 'Error getting readme, please check your username.',
  })
})
