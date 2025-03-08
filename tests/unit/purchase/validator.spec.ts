import { createPurchaseValidator } from '#validators/purchase'
import { test } from '@japa/runner'

test.group('Create purchase validator', () => {
  test('should validate purchase data')
    .with([
      {
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: 2,
          },
        ],
        cardNumbers: '5569123456789010',
        cardCvv: '010',
      },
      {
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: 2,
          },
          {
            productId: crypto.randomUUID(),
            quantity: 1,
          },
        ],
        cardNumbers: '5569123456789010  ',
        cardCvv: '010',
      },
      {
        clientName: 'Client',
        clientEmail: 'client@adonis.com',
        products: [
          {
            productId: crypto.randomUUID(),
            quantity: '2',
          },
        ],
        cardNumbers: '5569123456789010',
        cardCvv: '  010',
      },
    ])
    .run(async ({ expect }, purchaseData) => {
      const validatedData = await createPurchaseValidator.validate(purchaseData)
      expect(validatedData.clientName).toBe(purchaseData.clientName)
      expect(validatedData.clientEmail).toBe(purchaseData.clientEmail)
      expect(validatedData.cardNumbers).toBe(purchaseData.cardNumbers.trim())
      expect(validatedData.cardCvv).toBe(purchaseData.cardCvv.trim())
      expect(validatedData.products).toHaveLength(purchaseData.products.length)
      for (let i = 0; i < validatedData.products.length; i++) {
        expect(validatedData.products[i].productId).toBe(purchaseData.products[i].productId)
        expect(validatedData.products[i].quantity).toBe(+purchaseData.products[i].quantity)
      }
    })

  test('should fail to validate purchase data for [invalid client name]', ({
    expect,
  }, clientName) => {
    const input = {
      clientName,
      clientEmail: 'client@adonis.com',
      products: [{ productId: crypto.randomUUID(), quantity: 1 }],
      cardNumbers: '5569123456789010',
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with([
    '',
    '   ',
    'abcghsldkjfhglksjhdflgkjshdflkjghsldkjfhgksjhdfkjhsdfkgljhsldkfjghlskjdfhglkjshdflgkjhsdlfkjghslkdjfhglskdjfhglksjdhfglfkgjsldkfjhglkajdshflakjsdhflkajhdsglkajshdlkfjahsdlfkjhalsdkjfhalksdjfhlaksjdhflkajshdflkajshdflksjdhfglksjdhfglksjdhfglksjhdflgkjshdlf',
  ])

  test('should fail to validate purchase data for [invalid client email]', ({
    expect,
  }, clientEmail) => {
    const input = {
      clientName: 'client',
      clientEmail,
      products: [{ productId: crypto.randomUUID(), quantity: 1 }],
      cardNumbers: '5569123456789010',
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'abc', 'abc@', 'abc@abc'])

  test('should fail to validate purchase data for [invalid products]', ({ expect }, products) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products,
      cardNumbers: '5569123456789010',
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with([
    [],
    ['asdas'],
    [{}],
    [{}, {}],
    () => {
      const productId = crypto.randomUUID()
      return [
        { productId, quantity: 2 },
        { productId, quantity: 1 },
      ]
    },
  ])

  test("should fail to validate purchase data for [invalid product's id]", ({
    expect,
  }, products) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products,
      cardNumbers: '5569123456789010',
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with([
    [{ productId: '', quantity: 2 }],
    [{ productId: '   ', quantity: 2 }],
    [{ productId: 'asdasfasdfa', quantity: 2 }],
    [{ productId: 5, quantity: 2 }],
  ])

  test("should fail to validate purchase data for [invalid product's quantity]", ({
    expect,
  }, products) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products,
      cardNumbers: '5569123456789010',
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with([
    [{ productId: crypto.randomUUID(), quantity: '' }],
    [{ productId: crypto.randomUUID(), quantity: '   ' }],
    [{ productId: crypto.randomUUID(), quantity: 'asdf' }],
    [{ productId: crypto.randomUUID(), quantity: 0 }],
    [{ productId: crypto.randomUUID(), quantity: 5.1 }],
    [{ productId: crypto.randomUUID(), quantity: 0.05 }],
    [{ productId: crypto.randomUUID(), quantity: '0.05' }],
    [{ productId: crypto.randomUUID(), quantity: -2 }],
  ])

  test('should fail to validate purchase data for [invalid card number]', ({
    expect,
  }, cardNumbers) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products: [{ productId: crypto.randomUUID(), quantity: 1 }],
      cardNumbers,
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', '1a0d55s1d651s555', '15406545987', '655149846516540540654870'])

  test('should fail to validate purchase data for [invalid card cardCvv]', ({
    expect,
  }, cardCvv) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products: [{ productId: crypto.randomUUID(), quantity: 1 }],
      cardNumbers: '5569123456789010',
      cardCvv,
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'a10', '01', '1540654'])

  test('should fail to validate purchase data [missing client name]', ({ expect }) => {
    const input = {
      clientEmail: 'client@adonis.com',
      products: [{ productId: crypto.randomUUID(), quantity: 1 }],
      cardNumbers: '5569123456789010',
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  })

  test('should fail to validate purchase data [missing client email]', ({ expect }) => {
    const input = {
      clientName: 'Client',
      products: [{ productId: crypto.randomUUID(), quantity: 2 }],
      cardNumbers: '5569123456789010',
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  })

  test('should fail to validate purhcase data [missing products]', ({ expect }) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      cardNumbers: '5569123456789010',
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  })

  test("should fail to validate purhcase data [missing product's id]", ({ expect }, products) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products,
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with([[{ quantity: 2 }], [{ productId: crypto.randomUUID(), quantity: 2 }, { quantity: 2 }]])

  test("should fail to validate purhcase data [missing product's quantity]", ({
    expect,
  }, products) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products,
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  }).with([
    [{ productId: crypto.randomUUID() }],
    [{ productId: crypto.randomUUID(), quantity: 2 }, { productId: crypto.randomUUID() }],
  ])

  test('should fail to validate purhcase data [missing card number]', ({ expect }) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products: [{ productId: crypto.randomUUID(), quantity: 2 }],
      cardCvv: '010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  })

  test('should fail to validate purhcase data [missing card cvv]', ({ expect }) => {
    const input = {
      clientName: 'client',
      clientEmail: 'client@adonis.com',
      products: [{ productId: crypto.randomUUID(), quantity: 2 }],
      cardNumbers: '5569123456789010',
    }
    expect(() => createPurchaseValidator.validate(input)).rejects.toThrowError()
  })
})
