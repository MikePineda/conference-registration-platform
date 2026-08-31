import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import { UserFactory } from '#database/factories/user_factory'

test.group('Auth / Signup', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('registers a new organizer and returns a token', async ({ client, assert }) => {
    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'Miguel Pineda',
      email: 'miguel@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      data: { user: { fullName: 'Miguel Pineda', email: 'miguel@example.com' } },
    })
    assert.exists(response.body().data.token)
    assert.notProperty(response.body().data.user, 'password')

    const user = await User.findByOrFail('email', 'miguel@example.com')
    assert.notEqual(user.password, 'password123')
  })

  test('fails when the email is already registered', async ({ client }) => {
    await UserFactory.merge({ email: 'taken@example.com' }).create()

    const response = await client.post('/api/v1/auth/signup').json({
      fullName: 'Someone Else',
      email: 'taken@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ field: 'email', rule: 'database.unique' }],
    })
  })
})
