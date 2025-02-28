import { inject } from '@adonisjs/core'
import { UserDAO, UserDTO } from '../../../../contracts/user_dao.js'

@inject()
export class ListUsers {
  constructor(private userDAO: UserDAO) {}

  async execute(): Promise<UserDTO[]> {
    return await this.userDAO.getAllUsers()
  }
}
