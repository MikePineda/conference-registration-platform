import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'

test.group('Models & factories', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('creates organizer with conferences and reservations', async ({ assert }) => {
    const organizer = await UserFactory.with('conferences', 2, (conference) =>
      conference.with('reservations', 3)
    ).create()

    await organizer.load('conferences', (query) => query.preload('reservations'))

    assert.lengthOf(organizer.conferences, 2)
    for (const conference of organizer.conferences) {
      assert.equal(conference.organizerId, organizer.id)
      assert.match(conference.publicId, /^[0-9a-f-]{36}$/)
      assert.lengthOf(conference.reservations, 3)
      for (const reservation of conference.reservations) {
        assert.equal(reservation.conferenceId, conference.id)
        assert.match(reservation.reservationCode, /^[A-HJKMNP-Z2-9]{8}$/)
      }
    }
  })
})
