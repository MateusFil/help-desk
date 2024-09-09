'use strict'

const Schema = use('Schema')

class TokensSchema extends Schema {
  up () {
    this.create('tokens', (table) => {
      table.increments() // ID da tabela
      table.integer('user_id').unsigned().notNullable() // ID do usuário
      table.enu('user_type', ['users', 'users_admin']).notNullable() // Tipo de usuário
      table.string('token', 255).notNullable().unique().index() // Token
      table.string('type', 80).notNullable() // Tipo de token
      table.boolean('is_revoked').defaultTo(false) // Indica se o token foi revogado
      table.timestamps() // Created_at e Updated_at
    })
  }

  down () {
    this.drop('tokens') // Remove a tabela se a migration for revertida
  }
}

module.exports = TokensSchema
