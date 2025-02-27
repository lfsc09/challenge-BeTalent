/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ProductsController from '#controllers/products_controller'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

/**
 * USERS
 */
router.get('/users', [UsersController, 'allUsers'])
router.post('/users', [UsersController, 'newUser'])
router.put('/users/:id', [UsersController, 'editUser'])
router.delete('/users/:id', [UsersController, 'deleteUser'])

/**
 * PRODUCTS
 */
router.get('/products', [ProductsController, 'allProducts'])
router.post('/products', [ProductsController, 'newProduct'])
router.put('/products/:id', [ProductsController, 'editProduct'])
router.delete('/products/:id', [ProductsController, 'deleteProduct'])
