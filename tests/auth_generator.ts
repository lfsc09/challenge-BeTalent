import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'

export const generateUserToken = async (role: string): Promise<string> => {
  const user = await UserFactory.merge({ role }).create()
  const token = await User.accessTokens.create(user)
  return token.toJSON().token!
}
