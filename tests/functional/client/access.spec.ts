import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'

test.group('Client route access', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should access route ({$self})')
    .with(['USER', 'ADMIN'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const listOutput = await client.get('/clients').header('Authorization', `Bearer ${token}`)
      expect(listOutput.status()).not.toBe(401)
      expect(listOutput.status()).not.toBe(403)
      const detailsOutput = await client
        .get(`/clients/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(detailsOutput.status()).not.toBe(401)
      expect(detailsOutput.status()).not.toBe(403)
    })

  test('should fail to access route [not authenticated]', async ({ client, expect }) => {
    const listOutput = await client.get('/clients')
    expect(listOutput.status()).toBe(401)
    const detailsOutput = await client.get(`/clients/${crypto.randomUUID()}`)
    expect(detailsOutput.status()).toBe(401)
  })

  test('should fail to access route [not authorized] ({$self})')
    .with(['FINANCE', 'MANAGER'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const listOutput = await client.get('/clients').header('Authorization', `Bearer ${token}`)
      expect(listOutput.status()).toBe(403)
      const detailsOutput = await client
        .get(`/clients/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(detailsOutput.status()).toBe(403)
    })
})
