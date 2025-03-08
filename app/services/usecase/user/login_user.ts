import { inject } from '@adonisjs/core'
import { LoginUserDTO, UserDAO } from '../../../../contracts/user_dao.js'

@inject()
export class LoginUser {
  constructor(private userDAO: UserDAO) {}

  async execute(input: LoginUserDTO): Promise<{ token: string | undefined }> {
    const accessToken = await this.userDAO.getUserToken(input)
    return {
      token: accessToken.toJSON().token,
    }
  }
}
