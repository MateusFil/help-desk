'use strict'

const Schema = use('Schema')

class UsersSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments() // ID da tabela
      table.string('nome_completo', 80).notNullable() // Nome completo do usuário
      table.string('email', 254).notNullable().unique() // Email do usuário
      table.string('password', 60).notNullable() // Senha do usuário
      table.integer('tipo').defaultTo(2) // 1: Admin, 2: Usuário Comum, 3: Técnico de TI
      table.enu('setor', ['TI', 'RH', 'ADM', 'FINANCEIRO', 'ESTOQUE', 'PRODUCAO']) // Setores
      table.timestamps() // Created_at e Updated_at
    })
  }

  down () {
    this.drop('users') // Remove a tabela se a migration for revertida
  }
}

module.exports = UsersSchema
