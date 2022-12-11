import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
// routes
import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/signIn'
import { signOutRouter } from './routes/signOut'
import { signUpRouter } from './routes/signUp'
// database ODCB
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
// error handler
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: true,
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

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined.')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('Connected to mongodb!')
  } catch (error) {
    console.error(error)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!!!!!')
  })
}

start()
