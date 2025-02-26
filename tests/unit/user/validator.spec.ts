import { createUserValidator, updateUserValidator } from '#validators/user'
import { test } from '@japa/runner'

test.group('Create user validator', () => {
  test('should validate user data', async ({ expect }, userData) => {
    const validatedData = await createUserValidator.validate(userData)
    expect(validatedData).toEqual(userData)
  }).with([
    {
      email: 'user@adonis.com',
      password: 'password',
      role: 'USER',
    },
    {
      email: 'email@adonis.com',
      password: 'password',
      role: 'MANAGER',
    },
    {
      email: 'admin@adonis.com',
      password: 'password',
      role: 'ADMIN',
    },
    {
      email: 'finance@adonis.com',
      password: 'password',
      role: 'FINANCE',
    },
  ])

  test('should fail to validate user data for [invalid email]', ({ expect }, email) => {
    const input = {
      email,
      password: 'password',
      role: 'USER',
    }
    expect(() => createUserValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'abc', 'abc@', 'abc@abc'])

  test('should fail to validate user data for [invalid password]', ({ expect }, password) => {
    const input = {
      email: 'user@adonis.com',
      password,
      role: 'USER',
    }
    expect(() => createUserValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'adf', 'asdfasd'])

  test('should fail to validate user data for [invalid role]', ({ expect }, role) => {
    const input = {
      email: 'user@adonis.com',
      password: 'password',
      role,
    }
    expect(() => createUserValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'ADMINS', 'ABC'])

  test('should fail to validate user data [missing email]', ({ expect }) => {
    const input = {
      password: 'password',
      role: 'USER',
    }
    expect(() => createUserValidator.validate(input)).rejects.toThrowError()
  })

  test('should fail to validate user data [missing password]', ({ expect }) => {
    const input = {
      email: 'user@adonis.com',
      role: 'USER',
    }
    expect(() => createUserValidator.validate(input)).rejects.toThrowError()
  })

  test('should fail to validate user data [missing role]', ({ expect }) => {
    const input = {
      email: 'user@adonis.com',
      password: 'password',
    }
    expect(() => createUserValidator.validate(input)).rejects.toThrowError()
  })
})

test.group('Update user validator', () => {
  test('should validate user data', async ({ expect }, userData) => {
    const validatedData = await updateUserValidator.validate(userData)
    expect(validatedData).toEqual(userData)
  }).with([
    {
      email: 'user@adonis.com',
      password: 'password',
      role: 'USER',
    },
    {
      email: 'email@adonis.com',
      password: 'password',
      role: 'MANAGER',
    },
    {
      email: 'admin@adonis.com',
      password: 'password',
      role: 'ADMIN',
    },
    {
      email: 'finance@adonis.com',
      password: 'password',
      role: 'FINANCE',
    },
    {
      password: 'password',
      role: 'USER',
    },
    {
      email: 'user@adonis.com',
      role: 'USER',
    },
    {
      email: 'user@adonis.com',
      password: 'password',
    },
  ])

  test('should fail to validate user data for [invalid email]', ({ expect }, email) => {
    const input = {
      email: email,
      password: 'password',
      role: 'USER',
    }
    expect(() => updateUserValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'abc', 'abc@', 'abc@abc'])

  test('should fail to validate user data for [invalid password]', ({ expect }, password) => {
    const input = {
      email: 'user@adonis.com',
      password: password,
      role: 'USER',
    }
    expect(() => updateUserValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'asv', 'asd@wqw'])

  test('should fail to validate user data for [invalid role]', ({ expect }, role) => {
    const input = {
      email: 'user@adonis.com',
      password: 'password',
      role: role,
    }
    expect(() => updateUserValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'ADMINS', 'ABC'])
})
