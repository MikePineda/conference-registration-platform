import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { ConferenceFactory } from '#database/factories/conference_factory'

test.group('Public conferences', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('anyone can view a conference through its public id', async ({ client, assert }) => {
    const owner = await UserFactory.create()
    const conference = await ConferenceFactory.merge({ organizerId: owner.id })
      .with('reservations', 2)
      .create()

    const response = await client.get(`/api/v1/public/conferences/${conference.publicId}`)

    response.assertStatus(200)
    response.assertBodyContains({
      data: { name: conference.name, capacity: conference.capacity, reservationsCount: 2 },
    })
    assert.notProperty(response.body().data, 'organizerId')
  })

  test('unknown public id returns 404', async ({ client }) => {
    const response = await client.get(
      '/api/v1/public/conferences/00000000-0000-0000-0000-000000000000'
    )

    response.assertStatus(404)
  })
})
