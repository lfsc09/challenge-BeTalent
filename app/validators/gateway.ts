import vine from '@vinejs/vine'

export const updateActiveGatewayValidator = vine.compile(
  vine.object({
    isActive: vine.boolean({ strict: true }),
  })
)

export const updatePriorityGatewayValidator = vine.compile(
  vine.object({
    priority: vine.number().positive().min(0).withoutDecimals(),
  })
)
