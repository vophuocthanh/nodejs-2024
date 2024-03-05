import { Request, Response } from 'express'
import { AuthService } from '~/service/auth/auth.service'

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const data = await AuthService.signUp(email, password)
  return res.json(data)
}

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = await req.body

  const data = await AuthService.signIn(email, password)
  return res.json(data)
}
