import { userRole } from '#abilities/main'
import { CreateUser } from '#services/usecase/user/create_user'
import { DeleteUser } from '#services/usecase/user/delete_user'
import { ListUsers } from '#services/usecase/user/list_users'
import { LoginUser } from '#services/usecase/user/login_user'
import { UpdateUser } from '#services/usecase/user/update_user'
import { createUserValidator, loginValidator, updateUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  @inject()
  async login({ request, response }: HttpContext, loginUser: LoginUser) {
    const input = await request.validateUsing(loginValidator)
    const output = await loginUser.execute(input)
    return response.status(200).json(output)
  }

  @inject()
  async allUsers({ response, bouncer }: HttpContext, listUsers: ListUsers) {
    if (await bouncer.denies(userRole, ['MANAGER', 'ADMIN'])) return response.forbidden()
    const users = await listUsers.execute()
    return response.status(200).json(users)
  }

  @inject()
  async newUser({ request, response, bouncer }: HttpContext, createUser: CreateUser) {
    if (await bouncer.denies(userRole, ['MANAGER', 'ADMIN'])) return response.forbidden()
    const input = await request.validateUsing(createUserValidator)
    await createUser.execute(input)
    return response.status(201)
  }

  @inject()
  async editUser({ request, response, params, bouncer }: HttpContext, updateUser: UpdateUser) {
    if (await bouncer.denies(userRole, ['MANAGER', 'ADMIN'])) return response.forbidden()
    const input = await request.validateUsing(updateUserValidator)
    await updateUser.execute(params.id, input)
    return response.status(200)
  }

  @inject()
  async deleteUser({ response, params, bouncer }: HttpContext, deleteUser: DeleteUser) {
    if (await bouncer.denies(userRole, ['MANAGER', 'ADMIN'])) return response.forbidden()
    await deleteUser.execute(params.id)
    return response.status(200)
  }
}
