import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { ConferenceFactory } from '#database/factories/conference_factory'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password123',
    }
  })
  .relation('conferences', () => ConferenceFactory)
  .build()
