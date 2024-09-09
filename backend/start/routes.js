const Route = use('Route')

// Definindo a rota para a página de login
Route.get('/', 'AuthController.loginView')

Route.delete('deletar_usuario', 'UserAdminController.deletarUsuario')
// Logar
Route.post('login', 'AuthController.login')

// Rota protegida com autenticação JWT
Route.get('user', 'AuthController.getUser').middleware(['auth'])

// Registrar usuarios
Route.post('register', 'UserAdminController.register')

// Rota protegida com autenticação JWT
Route.get('listar_usuarios', 'UserAdminController.listarUsuarios')

// Rota para atualizar usuário
Route.put('editar_usuario', 'UserAdminController.editarUsuario')
