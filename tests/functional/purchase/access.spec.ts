import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'

test.group('Purchase route access', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should access "list" and "details" routes ({$self})')
    .with(['USER', 'ADMIN'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const listOutput = await client.get('/purchases').header('Authorization', `Bearer ${token}`)
      expect(listOutput.status()).not.toBe(401)
      expect(listOutput.status()).not.toBe(403)
      const detailsOutput = await client
        .get(`/purchases/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(detailsOutput.status()).not.toBe(401)
      expect(detailsOutput.status()).not.toBe(403)
    })

  test('should fail to access "list" and "details" routes [not authenticated]', async ({
    client,
    expect,
  }) => {
    const listOutput = await client.get('/purchases')
    expect(listOutput.status()).toBe(401)
    const detailsOutput = await client.get(`/purchases/${crypto.randomUUID()}`)
    expect(detailsOutput.status()).toBe(401)
  })

  test('should fail to access "list" and "details" routes [not authorized] ({$self})')
    .with(['FINANCE', 'MANAGER'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const listOutput = await client.get('/purchases').header('Authorization', `Bearer ${token}`)
      expect(listOutput.status()).toBe(403)
      const detailsOutput = await client
        .get(`/purchases/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(detailsOutput.status()).toBe(403)
    })

  test('should access "reimburse" route ({$self})')
    .with(['FINANCE', 'ADMIN'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const reimburseOutput = await client
        .post(`/reimburse/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(reimburseOutput.status()).not.toBe(401)
      expect(reimburseOutput.status()).not.toBe(403)
    })

  test('should fail to access "reimburse" route [not authenticated]', async ({
    client,
    expect,
  }) => {
    const reimburseOutput = await client.post(`/reimburse/${crypto.randomUUID()}`)
    expect(reimburseOutput.status()).toBe(401)
  })

  test('should fail to access "reimburse" route [not authorized] ({$self})')
    .with(['USER', 'MANAGER'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const reimburseOutput = await client
        .post(`/reimburse/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(reimburseOutput.status()).toBe(403)
    })
})
