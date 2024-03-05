import { NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Context } from 'vm'
import { db } from '~/db/db'
import { UnauthorizedException } from '~/utils/exceptions'

export const auth = async (c: Context, next: NextFunction) => {
  try {
    const authHeader = c.req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      throw new UnauthorizedException('Unauthorized')
    }
    const data = jwt.verify(token, 'JWT_SECRET') as { userID: string }

    const user = await db.user.findUnique({
      where: {
        id: data.userID
      }
    })

    c.set('user', user)
    await next()
  } catch (error) {
    console.log(error)
    throw new UnauthorizedException('Unauthorized')
  }
}
