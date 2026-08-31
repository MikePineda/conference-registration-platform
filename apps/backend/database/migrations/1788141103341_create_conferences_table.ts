import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conferences'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table
        .integer('organizer_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('name', 200).notNullable()
      table.text('description')
      table.string('image_url', 1000)
      table.string('location', 200)
      table.integer('capacity').notNullable()

      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').nullable()

      table.uuid('public_id').notNullable().unique()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
