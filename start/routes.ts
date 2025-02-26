/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

/**
 * USERS
 */
router.get('/users', [UsersController, 'allUsers'])
router.post('/users', [UsersController, 'newUser'])
router.put('/users/:id', [UsersController, 'editUser'])
router.delete('/users/:id', [UsersController, 'deleteUser'])
