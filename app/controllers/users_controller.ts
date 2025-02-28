import { CreateUser } from '#services/usecase/user/create_user'
import { DeleteUser } from '#services/usecase/user/delete_user'
import { ListUsers } from '#services/usecase/user/list_users'
import { UpdateUser } from '#services/usecase/user/update_user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  @inject()
  async allUsers({ response }: HttpContext, listUsers: ListUsers) {
    const users = await listUsers.execute()
    return response.status(200).json(users)
  }

  @inject()
  async newUser({ request, response }: HttpContext, createUser: CreateUser) {
    const input = await request.validateUsing(createUserValidator)
    await createUser.execute(input)
    return response.status(201)
  }

  @inject()
  async editUser({ request, response, params }: HttpContext, updateUser: UpdateUser) {
    const input = await request.validateUsing(updateUserValidator)
    await updateUser.execute(params.id, input)
    return response.status(200)
  }

  @inject()
  async deleteUser({ response, params }: HttpContext, deleteUser: DeleteUser) {
    await deleteUser.execute(params.id)
    return response.status(200)
  }
}
