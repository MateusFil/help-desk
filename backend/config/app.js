'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
  name: Env.get('APP_NAME', 'AdonisJs'),

  appKey: Env.getOrFail('APP_KEY'),

  http: {
    port: Env.get('PORT', 3333),
    host: Env.get('HOST', '127.0.0.1'),
    allowMethodSpoofing: true,
    trustProxy: false,
    subdomainOffset: 2,
    jsonpCallback: 'callback',
    etag: false
  },

  appUrl: Env.get('APP_URL', 'http://127.0.0.1:3333'),

  views: {
    cache: Env.get('CACHE_VIEWS', true)
  },

  static: {
    dotfiles: 'ignore',
    etag: true,
    extensions: false
  },

  locales: {
    loader: 'file',
    locale: 'en'
  },

  logger: {
    transport: 'console',
    console: {
      driver: 'console',
      name: 'adonis-app',
      level: 'info'
    },
    file: {
      driver: 'file',
      name: 'adonis-app',
      filename: 'adonis.log',
      level: 'info'
    }
  },

  cookie: {
    httpOnly: true,
    sameSite: false,
    path: '/',
    maxAge: 7200
  }
}
