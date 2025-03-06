import UserModel from '#models/user'
import { CreateUserDTO, UpdateUserDTO, UserDAO, UserDTO } from '../../../contracts/user_dao.js'

export class UserDAODatabase implements UserDAO {
  async getAllUsers(): Promise<UserDTO[]> {
    return (await UserModel.all()).map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))
  }

  async createUser(input: CreateUserDTO): Promise<void> {
    await UserModel.create(input)
  }

  async updateUser(id: string, input: UpdateUserDTO): Promise<void> {
    const user = await UserModel.findOrFail(id)
    user.merge(input)
    await user.save()
  }

  async deleteUser(id: string): Promise<void> {
    const user = await UserModel.findOrFail(id)
    await user.delete()
  }
}
