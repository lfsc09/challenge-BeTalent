import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
      role: faker.helpers.arrayElement(['USER', 'FINANCE', 'MANAGER', 'ADMIN']),
    }
  })
  .build()
