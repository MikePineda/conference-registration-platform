/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('conferences/:publicId', [controllers.PublicConferences, 'show'])
      })
      .prefix('public')
      .as('public')

    router
      .group(() => {
        router.get('', [controllers.Conferences, 'index'])
        router.post('', [controllers.Conferences, 'store'])
        router.get(':id', [controllers.Conferences, 'show'])
        router.put(':id', [controllers.Conferences, 'update'])
        router.delete(':id', [controllers.Conferences, 'destroy'])
      })
      .prefix('conferences')
      .as('conferences')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
