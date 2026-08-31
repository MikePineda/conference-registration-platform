import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'

test.group('Auth / Login', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('logs in with valid credentials and returns a token', async ({ client, assert }) => {
    const user = await UserFactory.merge({
      email: 'organizer@example.com',
      password: 'password123',
    }).create()

    const response = await client.post('/api/v1/auth/login').json({
      email: 'organizer@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      data: { user: { id: user.id, email: 'organizer@example.com' } },
    })
    assert.exists(response.body().data.token)
  })

  test('fails with invalid credentials', async ({ client }) => {
    await UserFactory.merge({
      email: 'organizer@example.com',
      password: 'password123',
    }).create()

    const response = await client.post('/api/v1/auth/login').json({
      email: 'organizer@example.com',
      password: 'wrong-password',
    })

    response.assertStatus(400)
    response.assertBodyContains({
      errors: [{ message: 'Invalid user credentials' }],
    })
  })
})
