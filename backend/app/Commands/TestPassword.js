'use strict'

const { Command } = require('@adonisjs/ace')
const Hash = use('Hash')

class TestPassword extends Command {
  static get signature () {
    return 'test:password'
  }

  static get description () {
    return 'Test a password against a hash to see if they match'
  }

  async handle () {
    const password = await this.ask('Enter the plain password:')
    const hash = await this.ask('Enter the hash to compare against:')

    try {
      const isMatch = await Hash.verify(password, hash)
      this.info(`Password match: ${isMatch}`)
    } catch (error) {
      this.error(`Error verifying password: ${error.message}`)
    }
  }
}

module.exports = TestPassword
