import { createProductValidator, updateProductValidator } from '#validators/product'
import { test } from '@japa/runner'
import Big from 'big.js'

test.group('Create product validator', () => {
  test('should validate product data', async ({ expect }, userData) => {
    const validatedData = await createProductValidator.validate(userData)
    expect(validatedData.name).toBe(userData.name)
    expect(validatedData.amount).toBeInstanceOf(Big)
  }).with([
    {
      name: 'product one',
      amount: 100.5,
    },
    {
      name: 'Product 2',
      amount: 1.0,
    },
    {
      name: 'PRODUCT3',
      amount: 0,
    },
    {
      name: 'Product',
      amount: 1500750890.55,
    },
    {
      name: 'Product',
      amount: '10.50',
    },
    {
      name: 'Product',
      amount: '',
    },
    {
      name: 'Product',
      amount: '   ',
    },
  ])

  test('should fail to validate product data for [invalid name]', ({ expect }, name) => {
    const input = {
      name,
      amount: 10,
    }
    expect(() => createProductValidator.validate(input)).rejects.toThrowError()
  }).with([
    '',
    '   ',
    'wievrunowiemucrowienvurowicemurowivenrowicmeuoriwnveorwimceoriwuvenoriwmceoriwnveoriwmueociwneovrimwueocrinuvwoeirumwcoeirunowimveowinecowimeroviwneorcimweorivunwoeicmurowieuvrnowiemcrowievurnowimecowienruvowiemfkjlskdjfoiwjeflksjdfowiejflskdfjowiejfafsdd',
  ])

  test('should fail to validate product data for [invalid amount]', ({ expect }, amount) => {
    const input = {
      name: 'product 1',
      amount,
    }
    expect(() => createProductValidator.validate(input)).rejects.toThrowError()
  }).with(['abc', -1, -0.1, -0.0001, 100.544, 0.12345])

  test('should fail to validate product data [missing name]', ({ expect }) => {
    const input = {
      amount: 10.0,
    }
    expect(() => createProductValidator.validate(input)).rejects.toThrowError()
  })

  test('should fail to validate product data [missing amount]', ({ expect }) => {
    const input = {
      name: 'product 1',
    }
    expect(() => createProductValidator.validate(input)).rejects.toThrowError()
  })
})

test.group('Update product validator', () => {
  test('should validate product data', async ({ expect }, userData) => {
    const validatedData = await updateProductValidator.validate(userData)
    if (validatedData?.name) expect(validatedData.name).toBe(userData.name)
    if (validatedData?.amount) expect(validatedData.amount).toBeInstanceOf(Big)
  }).with([
    {
      name: 'product one',
      amount: 100.5,
    },
    {
      name: 'Product 2',
      amount: 1.0,
    },
    {
      name: 'PRODUCT3',
      amount: 0,
    },
    {
      name: 'Product',
      amount: 1500750890.55,
    },
    {
      name: 'Product',
      amount: '',
    },
    {
      name: 'Product',
      amount: '   ',
    },
    {
      name: 'Product 4',
      amount: '10.50',
    },
    {
      name: 'Product two',
    },
    {
      amount: 100.75,
    },
  ])

  test('should fail to validate product data for [invalid name]', ({ expect }, name) => {
    const input = {
      name,
      amount: 10,
    }
    expect(() => updateProductValidator.validate(input)).rejects.toThrowError()
  }).with([
    '',
    '   ',
    'wievrunowiemucrowienvurowicemurowivenrowicmeuoriwnveorwimceoriwuvenoriwmceoriwnveoriwmueociwneovrimwueocrinuvwoeirumwcoeirunowimveowinecowimeroviwneorcimweorivunwoeicmurowieuvrnowiemcrowievurnowimecowienruvowiemfkjlskdjfoiwjeflksjdfowiejflskdfjowiejfafsdd',
  ])

  test('should fail to validate product data for [invalid amount]', ({ expect }, amount) => {
    const input = {
      name: 'product 1',
      amount,
    }
    expect(() => updateProductValidator.validate(input)).rejects.toThrowError()
  }).with(['abc', -1, -0.1, -0.0001, 100.544, 0.12345])
})
