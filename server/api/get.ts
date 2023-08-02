import type { Readme } from '@/types/readme'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = mongo.db()

  // must have URL
  if (!body.username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Error getting readme (no username provided).',
    })
  }

  console.log(`Getting readme for ${body.username}.`)

  try {
    // remove whitespace & caps
    const username = body.username.replace(/\s/g, '').toLowerCase()

    // get readme content from db
    const readme = await db.collection<Readme>('Readmes').findOne({ username })

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
