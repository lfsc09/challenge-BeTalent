import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
    role: vine.string().trim().in(['ADMIN', 'MANAGER', 'FINANCE', 'USER']),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().optional(),
    password: vine.string().trim().optional(),
    role: vine.string().trim().in(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
  })
)
