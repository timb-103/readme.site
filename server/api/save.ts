export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = mongo.db()

  // must have URL
  if (!body.username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Error saving readme (no username provided).',
    })
  }

  console.log(`Saving readme for ${body.username}.`)

  try {
    // remove whitespace & caps
    const username = body.username.replace(/\s/g, '').toLowerCase()

    // get the raw README.MD content
    const markdown = await $fetch(
      `https://raw.githubusercontent.com/${username}/${username}/main/README.md`
    )

    if (!markdown) {
      return createError({
        statusCode: 400,
        statusMessage: 'Error finding readme.',
      })
    }

    // add/update the readme content in db
    await db.collection('Readmes').updateOne(
      { username },
      {
        $setOnInsert: { created: new Date(), views: 0 },
        $set: {
          markdown,
          updated: new Date(),
        },
      },
      { upsert: true }
    )

    return username
  } catch (error) {
    console.log('Error saving readme:', error)
  }

  // return an error
  throw createError({
    statusCode: 400,
    statusMessage: 'Error saving readme, please check your username.',
  })
})
