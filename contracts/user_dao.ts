import { AccessToken } from '@adonisjs/auth/access_tokens'
import { DateTime } from 'luxon'

export abstract class UserDAO {
  abstract getUserToken(input: LoginUserDTO): Promise<AccessToken>
  abstract getAllUsers(): Promise<UserDTO[]>
  abstract createUser(input: CreateUserDTO): Promise<void>
  abstract updateUser(id: string, input: UpdateUserDTO): Promise<void>
  abstract deleteUser(id: string): Promise<void>
}

export type UserDTO = {
  id: string
  email: string
  role: string
  createdAt: DateTime
  updatedAt: DateTime
}

export type CreateUserDTO = {
  email: string
  password: string
  role: string
}

export type UpdateUserDTO = {
  email?: string
  password?: string
  role?: string
}

export type LoginUserDTO = {
  email: string
  password: string
}
