'use strict'

const Schema = use('Schema')

class RevokedTokensSchema extends Schema {
  up () {
    this.create('revoked_tokens', (table) => {
      table.increments()
      table.string('token', 255).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('revoked_tokens')
  }
}

module.exports = RevokedTokensSchema
