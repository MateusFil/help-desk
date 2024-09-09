'use strict'

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers são blocos de construção para seu aplicativo Adonis. Sempre que você
| instala um novo pacote específico do Adonis, chances são de que você o
| registrará aqui.
|
*/

const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/shield/providers/ShieldProvider',
  '@adonisjs/session/providers/SessionProvider',
  '@adonisjs/auth/providers/AuthProvider'
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers são necessários apenas quando você executa comandos ace.
| Por exemplo, provedores para migrações, testes etc.
|
*/

const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider'
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases são nomes curtos e exclusivos para vinculações do IoC container.
| Você pode criar seus próprios aliases.
|
*/

const aliases = {
  Auth: 'Adonis/Src/Auth'
}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Aqui você armazena comandos ace para seu pacote
|
*/

const commands = []

module.exports = { providers, aceProviders, aliases, commands }
