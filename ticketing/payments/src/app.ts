import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { createChargeRouter } from './routes/new'

// routes

// error handler
import { errorHandler, NotFoundError, currentUser } from '@dbtsr/common'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
)
app.use(currentUser)

app.use(createChargeRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
