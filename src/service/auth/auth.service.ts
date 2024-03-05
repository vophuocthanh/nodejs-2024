import { Prisma, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '~/db/db'
import { BadRequestException, UnauthorizedException } from '~/utils/exceptions'
import { hashPassword } from '~/utils/password'

const ACCESS_TOKEN_EXPIRES_IN = 60 * 60 * 24

export class AuthService {
  static async signIn(email: string, password: string) {
    const user = await db.user.findUnique({
      where: {
        email: email
      }
    })
    if (!user) {
      throw new UnauthorizedException(`Email ${email} not found`)
    }
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      throw new UnauthorizedException(`Invalid password`)
    }
    const accessToken = this.createToken(user.id)

    return { accessToken }
  }

  static async signUp(email: string, password: string) {
    try {
      if (!email || !password) {
        throw new BadRequestException(`Email and password are required`)
      }

      const salt = bcrypt.genSaltSync()
      const hashedPassword = await hashPassword(password, salt)

      const newUser = await db.user.create({
        data: {
          email: email,
          password: hashedPassword,
          salt: salt
        }
      })

      return newUser
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new UnauthorizedException(`User ${email} already exists`)
      } else {
        throw error
      }
    }
  }

  static createToken(userID: string) {
    return jwt.sign({ userID: userID }, 'JWT_SECRET', {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    })
  }
}
