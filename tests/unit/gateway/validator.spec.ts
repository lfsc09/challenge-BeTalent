import { updateActiveGatewayValidator, updatePriorityGatewayValidator } from '#validators/gateway'
import { test } from '@japa/runner'

test.group('Update gateway validator', () => {
  test("should validate gateway's active data")
    .with([
      {
        isActive: true,
      },
      {
        isActive: false,
      },
    ])
    .run(async ({ expect }, gatewayData) => {
      const validatedData = await updateActiveGatewayValidator.validate(gatewayData)
      expect(validatedData.isActive).toBe(Boolean(gatewayData.isActive))
    })

  test("should validate gateway's priority data")
    .with([
      {
        priority: 0,
      },
      {
        priority: 1,
      },
      {
        priority: 10,
      },
      {
        priority: '1',
      },
    ])
    .run(async ({ expect }, gatewayData) => {
      const validatedData = await updatePriorityGatewayValidator.validate(gatewayData)
      expect(validatedData.priority).toBe(+gatewayData.priority)
    })

  test("should fail to validate gateway's active data", async ({ expect }, isActive) => {
    const input = {
      isActive,
    }
    expect(() => updateActiveGatewayValidator.validate(input)).rejects.toThrowError()
  }).with(['', '   ', 'abc', 'false', 0, 1, 4, 'true'])

  test("should fail to validate gateway's priority data", async ({ expect }, priority) => {
    const input = {
      priority,
    }
    expect(() => updatePriorityGatewayValidator.validate(input)).rejects.toThrowError()
  }).with(['false', 'abc', -1, 1.5])

  test("should fail to validate gateway's active data [missing isActive]", async ({ expect }) => {
    expect(() => updateActiveGatewayValidator.validate({})).rejects.toThrowError()
  })

  test("should fail to validate gateway's priority data [missing priority]", async ({ expect }) => {
    expect(() => updatePriorityGatewayValidator.validate({})).rejects.toThrowError()
  })
})
