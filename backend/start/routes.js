const Route = use('Route')

// Definindo a rota para a página de login
Route.get('/', 'AuthController.loginView')

// Gerenciamento de usuários
Route.delete('deletar_usuario', 'UserAdminController.deletarUsuario')
Route.post('register', 'UserAdminController.register')
Route.get('listar_usuarios', 'UserAdminController.listarUsuarios')
Route.put('editar_usuario', 'UserAdminController.editarUsuario')

// Autenticação
Route.post('login', 'AuthController.login')
Route.post('logout', 'AuthController.logout')
Route.get('user', 'AuthController.getUser').middleware(['auth'])

// Rotas para gerenciamento de tickets
Route.get('/atribuir_usuario', 'TicketController.AtribuirUsuario')
Route.post('/abrir_chamado', 'TicketController.store')
Route.get('/acompanhar_chamados', 'TicketController.index')
Route.get('/acompanhar_chat', 'MensagemController.listarMensagemChamado')
Route.post('/enviar_mensagem', 'MensagemController.store')
Route.put('/editar_chamado/:id', 'TicketController.update')
Route.put('/editar_atribuido/:id', 'TicketController.updateAtribuido')
Route.delete('/admin/deletar_chamado/:id', 'TicketController.destroy')
