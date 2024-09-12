// app/Models/Ticket.js
'use strict'

const Model = use('Model')

class Ticket extends Model {
  static get table () {
    return 'tickets'
  }
}

module.exports = Ticket
