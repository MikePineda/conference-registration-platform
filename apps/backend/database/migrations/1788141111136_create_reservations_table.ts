import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reservations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('conference_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('conferences')
        .onDelete('CASCADE')

      table.string('attendee_full_name', 254).notNullable()
      table.string('email', 254).notNullable()
      table.string('reservation_code', 8).notNullable().unique()

      table.unique(['conference_id', 'email'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
