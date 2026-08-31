import { randomInt } from 'node:crypto'
import { ReservationSchema } from '#database/schema'
import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Conference from '#models/conference'

/**
 * Alphabet without ambiguous characters (0/O, 1/I/L)
 * to keep codes easy to read and type, airline style.
 */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 8

export default class Reservation extends ReservationSchema {
  @belongsTo(() => Conference)
  declare conference: BelongsTo<typeof Conference>

  @beforeCreate()
  static assignReservationCode(reservation: Reservation) {
    if (!reservation.reservationCode) {
      reservation.reservationCode = Reservation.generateCode()
    }
  }

  static generateCode() {
    let code = ''
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]
    }
    return code
  }
}
