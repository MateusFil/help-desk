const Route = use('Route')

// Definindo a rota para a página de login
Route.get('/', 'AuthController.loginView')

Route.delete('deletar_usuario', 'UserAdminController.deletarUsuario')
// Logar
Route.post('login', 'AuthController.login')

Route.post('logout', 'AuthController.logout')

// Rota protegida com autenticação JWT
Route.get('user', 'AuthController.getUser').middleware(['auth'])

// Registrar usuarios
Route.post('register', 'UserAdminController.register')

// Rota protegida com autenticação JWT
Route.get('listar_usuarios', 'UserAdminController.listarUsuarios')

// Rota para atualizar usuário
Route.put('editar_usuario', 'UserAdminController.editarUsuario')

// Rotas para gerenciamento de tickets

// Listar usuários atribuíveis
Route.get('/atribuir_usuario', 'TicketController.AtribuirUsuario')

// Criar um novo chamado
Route.post('/abrir_chamado', 'TicketController.store')

// Listar todos os chamados (rota acessível apenas para administradores)
Route.get('/admin/acompanhar_chamados', 'TicketController.index')

// Listar chamados atribuidos ou que é responsavel
Route.get('/listar_chamados_usuarios', 'TicketController.listarChamadosUsuario')

// Editar um chamado por ID
Route.put('/editar_chamado/:id', 'TicketController.update')

// Deletar um chamado por ID
Route.delete('/admin/deletar_chamado/:id', 'TicketController.destroy')

