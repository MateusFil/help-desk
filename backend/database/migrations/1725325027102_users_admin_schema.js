'use strict'

const Schema = use('Schema')

class UsersAdminSchema extends Schema {
  up () {
    this.create('users_admin', (table) => {
      table.increments() // ID da tabela
      table.string('nome_completo', 80).notNullable() // Nome completo do usuário
      table.string('email', 254).notNullable().unique() // Email do usuário
      table.string('password', 60).notNullable() // Senha do usuário
      table.integer('tipo').defaultTo(1) // Tipo do usuário (1 para admin)
      table.timestamps() // Created_at e Updated_at
    })
  }

  down () {
    this.drop('users_admin') // Remove a tabela se a migration for revertida
  }
}

module.exports = UsersAdminSchema
