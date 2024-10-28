'use strict'

const Schema = use('Schema')

class MensagensSchema extends Schema {
  up () {
    this.create('mensagens', (table) => {
      table.increments('id') // ID da mensagem
      table.integer('id_chamado').unsigned().notNullable()
        .references('id').inTable('tickets')
        .onDelete('CASCADE') // Deleta as mensagens se o histórico for deletado
      table.text('mensagem').notNullable() // Conteúdo da mensagem
      table.text('responsavel').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('mensagens')
  }
}

module.exports = MensagensSchema