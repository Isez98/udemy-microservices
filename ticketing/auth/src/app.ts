import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
// routes
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signIn'
import { signOutRouter } from './routes/signOut'
import { signUpRouter } from './routes/signUp'

import cookieSession from 'cookie-session'
// error handler
import { errorHandler, NotFoundError } from '@dbtsr/common'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
