'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('confirmation_token')      
      table.boolean('is_active').defaultTo(0)
      table.boolean('strava_authorized').defaultTo(0)
      table.integer('strava_token_expires_at').defaultTo(0)
      table.integer('strava_token_expires_in').defaultTo(0)
      table.string('strava_token_access_token').defaultTo(0)      
      table.string('strava_token_refresh_token').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
