import User from '#models/user'
import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

test.group('User new', (group) => {
  let trx: TransactionClientContract

  group.each.setup(async () => {
    trx = await User.transaction()
    return () => trx.rollback()
  })

  test('sucessfully create user', async ({ expect }) => {
    const input = {
      email: 'user@adonis.com',
      password: 'password',
      role: 'USER',
    }
    const user = new User()
    user.email = input.email
    user.password = input.password
    user.role = input.role

    await user.useTransaction(trx).save()

    expect(user.id).toBeDefined()
    expect(user.createdAt).toBeDefined()
    expect(hash.isValidHash(user.password)).toBeTruthy()
    expect(await hash.verify(user.password, 'password')).toBeTruthy()
  })
})
