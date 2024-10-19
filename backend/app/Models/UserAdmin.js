'use strict'

const Model = use('Model')

class UserAdmin extends Model {
  static get table () {
    return 'users'
  }

  static get fillable () {
    return ['nome_completo', 'email', 'tipo', 'password']
  }
}

module.exports = UserAdmin
