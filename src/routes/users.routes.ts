import { Router } from 'express'
const userRouter = Router()

userRouter.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

userRouter.get('/', (req, res) => {
  res.json(' User from Router!')
})
userRouter.post('/login', (req, res) => {
  res.json({
    token: '123456'
  })
})

export default userRouter
