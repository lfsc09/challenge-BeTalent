import { inject } from '@adonisjs/core'
import { CreateUserDTO, UserDAO } from '../../../../contracts/user_dao.js'

@inject()
export class CreateUser {
  constructor(private userDAO: UserDAO) {}

  async execute(input: CreateUserDTO): Promise<void> {
    await this.userDAO.createUser(input)
  }
}
