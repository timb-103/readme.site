export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // save the readme content
  const username = await saveReadme(body.username)

  // return the username if it was successful
  if (username) {
    return username
  }

  // return an error
  throw createError({
    statusCode: 400,
    statusMessage: 'Error saving readme, please check your username.',
  })
})
