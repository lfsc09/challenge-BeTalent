import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().minLength(1).maxLength(500).email(),
    password: vine.string().trim().minLength(8),
    role: vine.string().trim().in(['ADMIN', 'MANAGER', 'FINANCE', 'USER']),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().minLength(1).maxLength(500).email().optional(),
    password: vine.string().trim().minLength(8).optional(),
    role: vine.string().trim().in(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
  })
)
