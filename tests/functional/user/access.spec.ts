import User from '#models/user'
import { generateUserToken } from '#tests/auth_generator'
import { test } from '@japa/runner'

test.group('User route access', (group) => {
  group.each.setup(async () => {
    await User.query().delete()
  })

  test('should access route ({$self})')
    .with(['MANAGER', 'ADMIN'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const listOutput = await client.get('/users').header('Authorization', `Bearer ${token}`)
      expect(listOutput.status()).not.toBe(401)
      expect(listOutput.status()).not.toBe(403)
      const newOutput = await client.post('/users').header('Authorization', `Bearer ${token}`)
      expect(newOutput.status()).not.toBe(401)
      expect(newOutput.status()).not.toBe(403)
      const editOutput = await client
        .put(`/users/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(editOutput.status()).not.toBe(401)
      expect(editOutput.status()).not.toBe(403)
      const deleteOutput = await client
        .delete(`/users/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(deleteOutput.status()).not.toBe(401)
      expect(deleteOutput.status()).not.toBe(403)
    })

  test('should fail to access route [not authenticated]', async ({ client, expect }) => {
    const listOutput = await client.get('/users')
    expect(listOutput.status()).toBe(401)
    const newOutput = await client.post('/users')
    expect(newOutput.status()).toBe(401)
    const editOutput = await client.put(`/users/${crypto.randomUUID()}`)
    expect(editOutput.status()).toBe(401)
    const deleteOutput = await client.delete(`/users/${crypto.randomUUID()}`)
    expect(deleteOutput.status()).toBe(401)
  })

  test('should fail to access route [not authorized] ({$self})')
    .with(['FINANCE', 'USER'])
    .run(async ({ client, expect }, userRole) => {
      const token = await generateUserToken(userRole)
      const listOutput = await client.get('/users').header('Authorization', `Bearer ${token}`)
      expect(listOutput.status()).toBe(403)
      const newOutput = await client.post('/users').header('Authorization', `Bearer ${token}`)
      expect(newOutput.status()).toBe(403)
      const editOutput = await client
        .put(`/users/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(editOutput.status()).toBe(403)
      const deleteOutput = await client
        .delete(`/users/${crypto.randomUUID()}`)
        .header('Authorization', `Bearer ${token}`)
      expect(deleteOutput.status()).toBe(403)
    })
})
