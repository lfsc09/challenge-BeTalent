import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const uniqueKey = 'email'

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'admin@betalent.com',
        password: 'admin',
        role: 'ADMIN',
      },
      {
        email: 'manager@betalent.com',
        password: 'manager',
        role: 'MANAGER',
      },
      {
        email: 'finance@betalent.com',
        password: 'finance',
        role: 'FINANCE',
      },
      {
        email: 'user@betalent.com',
        password: 'user',
        role: 'USER',
      },
    ])
  }
}
