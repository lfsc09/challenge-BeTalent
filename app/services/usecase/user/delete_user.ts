import { inject } from '@adonisjs/core'
import { UserDAO } from '../../../../contracts/user_dao.js'

@inject()
export class DeleteUser {
  constructor(private userDAO: UserDAO) {}

  async execute(id: string): Promise<void> {
    await this.userDAO.deleteUser(id)
  }
}
