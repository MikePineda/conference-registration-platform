import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'
import Conference from '#models/conference'
import { ReservationFactory } from '#database/factories/reservation_factory'

export const ConferenceFactory = factory
  .define(Conference, async ({ faker }) => {
    const startDate = DateTime.fromJSDate(faker.date.soon({ days: 90 }))

    return {
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      imageUrl: faker.image.urlPicsumPhotos({ width: 1200, height: 600 }),
      location: `${faker.location.city()}, ${faker.location.country()}`,
      capacity: faker.number.int({ min: 20, max: 500 }),
      startDate,
      endDate: startDate.plus({ hours: faker.number.int({ min: 2, max: 48 }) }),
    }
  })
  .relation('reservations', () => ReservationFactory)
  .build()
