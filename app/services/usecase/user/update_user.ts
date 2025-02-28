import { inject } from '@adonisjs/core'
import { UpdateUserDTO, UserDAO } from '../../../../contracts/user_dao.js'

@inject()
export class UpdateUser {
  constructor(private userDAO: UserDAO) {}

  async execute(id: string, input: UpdateUserDTO): Promise<void> {
    await this.userDAO.updateUser(id, input)
  }
}
