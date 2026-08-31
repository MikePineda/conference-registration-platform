import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { ConferenceFactory } from '#database/factories/conference_factory'

test.group('Conferences', (group) => {
  group.each.setup(() => testUtils.db().wrapInGlobalTransaction())

  test('organizer creates a conference', async ({ client, assert }) => {
    const organizer = await UserFactory.create()

    const response = await client.post('/api/v1/conferences').loginAs(organizer).json({
      name: 'AdonisConf 2026',
      location: 'Brisbane, Australia',
      capacity: 150,
      startDate: '2026-11-20T09:00:00.000Z',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      data: { name: 'AdonisConf 2026', location: 'Brisbane, Australia', capacity: 150 },
    })
    assert.exists(response.body().data.publicId)

    await organizer.load('conferences')
    assert.lengthOf(organizer.conferences, 1)
  })

  test('requires authentication', async ({ client }) => {
    const response = await client.post('/api/v1/conferences').json({
      name: 'AdonisConf 2026',
      capacity: 150,
      startDate: '2026-11-20T09:00:00.000Z',
    })

    response.assertStatus(401)
  })

  test('organizer cannot update a conference they do not own', async ({ client }) => {
    const owner = await UserFactory.create()
    const intruder = await UserFactory.create()
    const conference = await ConferenceFactory.merge({ organizerId: owner.id }).create()

    const response = await client
      .put(`/api/v1/conferences/${conference.id}`)
      .loginAs(intruder)
      .json({
        name: 'Hijacked Conference',
        capacity: 10,
        startDate: '2026-11-20T09:00:00.000Z',
      })

    response.assertStatus(404)
  })

  test('organizer updates their own conference', async ({ client }) => {
    const owner = await UserFactory.create()
    const conference = await ConferenceFactory.merge({ organizerId: owner.id }).create()

    const response = await client.put(`/api/v1/conferences/${conference.id}`).loginAs(owner).json({
      name: 'Renamed Conference',
      location: conference.location,
      capacity: 99,
      startDate: '2026-12-01T10:00:00.000Z',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      data: { id: conference.id, name: 'Renamed Conference', capacity: 99 },
    })
  })

  test('organizer cant create a conference with a capacity over 10000000', async ({ client }) => {
    const owner = await UserFactory.create()

    const response = await client.post(`/api/v1/conferences`).loginAs(owner).json({
      name: 'Big conference',
      location: 'Brisbane',
      capacity: 10000001,
      startDate: '2026-12-01T10:00:00.000Z',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [{ field: 'capacity', rule: 'max' }],
    })
  })
})
