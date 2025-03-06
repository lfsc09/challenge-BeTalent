import vine from '@vinejs/vine'

export const createPurchaseValidator = vine.compile(
  vine.object({
    clientName: vine.string().trim().minLength(1).maxLength(254),
    clientEmail: vine.string().trim().minLength(1).maxLength(500).email(),
    products: vine
      .array(
        vine.object({
          productId: vine.string().trim().uuid(),
          quantity: vine.number().positive().min(1).withoutDecimals(),
        })
      )
      .notEmpty()
      .distinct(['productId']),
    cardNumbers: vine.string().trim().regex(/^\d+$/).fixedLength(16),
    cardCvv: vine.string().trim().regex(/^\d+$/).fixedLength(3),
  })
)
