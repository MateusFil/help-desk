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

      // Alteração: campo prioridade em vez de tempo_execucao
      table.enu('prioridade', ['BP', 'MP', 'AP']).notNullable(); // BP: Baixa, MP: Média, AP: Alta

      table.string('status').notNullable();

      // Campos para registrar data e hora de criação e atualização
      table.timestamp('created_at').defaultTo(this.fn.now());
      table.timestamp('updated_at').defaultTo(this.fn.now());
    });
  }

  down() {
    this.drop('tickets');
  }
}

module.exports = TicketsSchema;
