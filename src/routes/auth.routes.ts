import { Router } from 'express'
import { signIn, signUp } from '~/controllers/users.controller'
const authRouter = Router()

authRouter.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

authRouter.get('/', (req, res) => {
  res.json(' User from Router!')
})

authRouter.post('/sign-in', signIn)

authRouter.post('/sign-up', signUp)

export default authRouter
