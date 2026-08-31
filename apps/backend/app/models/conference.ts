import { randomUUID } from 'node:crypto'
import { ConferenceSchema } from '#database/schema'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Reservation from '#models/reservation'

export default class Conference extends ConferenceSchema {
  @belongsTo(() => User, { foreignKey: 'organizerId' })
  declare organizer: BelongsTo<typeof User>

  @hasMany(() => Reservation)
  declare reservations: HasMany<typeof Reservation>

  @beforeCreate()
  static assignPublicId(conference: Conference) {
    if (!conference.publicId) {
      conference.publicId = randomUUID()
    }
  }
}
