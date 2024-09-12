'use strict';

const Schema = use('Schema');

class TicketsSchema extends Schema {
  up() {
    this.create('tickets', (table) => {
      table.increments();
      table.string('titulo').notNullable();
      table.text('descricao').notNullable();
      table.date('data_criacao').notNullable();
      table.string('responsavel').notNullable();
      table.string('atribuido').notNullable();
      table.integer('tempo_execucao').notNullable(); // Em horas
      table.string('status').notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop('tickets');
  }
}

module.exports = TicketsSchema;
