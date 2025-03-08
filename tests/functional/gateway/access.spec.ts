import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'

test.group('Gateway route access', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should access route ({$self})')
    .with(['USER', 'ADMIN'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const activeOutput = await client
        .put(`/gateways/${crypto.randomUUID()}/active`)
        .header('Authorization', `Bearer ${token}`)
      expect(activeOutput.status()).not.toBe(401)
      expect(activeOutput.status()).not.toBe(403)
      const priorityOutput = await client
        .put(`/gateways/${crypto.randomUUID()}/priority`)
        .header('Authorization', `Bearer ${token}`)
      expect(priorityOutput.status()).not.toBe(401)
      expect(priorityOutput.status()).not.toBe(403)
    })

  test('should fail to access route [not authenticated]', async ({ client, expect }) => {
    const activeOutput = await client.put(`/gateways/${crypto.randomUUID()}/active`)
    expect(activeOutput.status()).toBe(401)
    const priorityOutput = await client.put(`/gateways/${crypto.randomUUID()}/priority`)
    expect(priorityOutput.status()).toBe(401)
  })

  test('should fail to access route [not authorized] ({$self})')
    .with(['FINANCE', 'MANAGER'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const activeOutput = await client
        .put(`/gateways/${crypto.randomUUID()}/active`)
        .header('Authorization', `Bearer ${token}`)
      expect(activeOutput.status()).toBe(403)
      const priorityOutput = await client
        .put(`/gateways/${crypto.randomUUID()}/priority`)
        .header('Authorization', `Bearer ${token}`)
      expect(priorityOutput.status()).toBe(403)
    })
})
