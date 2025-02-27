import vine from '@vinejs/vine'
import Big from 'big.js'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(254),
    amount: vine
      .number()
      .positive()
      .decimal([0, 2])
      .transform((value) => new Big(value.toFixed(2))),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(254).optional(),
    amount: vine
      .number()
      .positive()
      .decimal([0, 2])
      .transform((value) => new Big(value.toFixed(2)))
      .optional(),
  })
)
