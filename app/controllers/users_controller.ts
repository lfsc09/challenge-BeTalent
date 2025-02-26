import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async allUsers({ response }: HttpContext) {
    const users = await User.all()
    return response.status(200).json(users)
  }

  async newUser({ request, response }: HttpContext) {
    const input = await request.validateUsing(createUserValidator)
    const output = await User.create(input)
    return response.status(output.$isPersisted ? 201 : 400)
  }

  async editUser({ request, response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const input = await request.validateUsing(updateUserValidator)
    user.merge(input)
    const output = await user.save()
    return response.status(output.$isPersisted ? 200 : 400)
  }

  async deleteUser({ response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.status(200)
  }
}
