'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments() // ID da tabela
      table.string('nome_completo', 80).notNullable() // Nome completo do usuário
      table.string('email', 254).notNullable().unique() // Email do usuário
      table.string('password', 60).notNullable() // Senha do usuário
      table.integer('tipo').defaultTo(2) // Tipo do usuário (2 para usuário comum)
      table.timestamps() // Created_at e Updated_at
    })
  }

  down () {
    this.drop('users') // Remove a tabela se a migration for revertida
  }
}

module.exports = UsersSchema
