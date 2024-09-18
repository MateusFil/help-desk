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
Route.get('/admin/acompanhar_chamados', 'TicketController.index')
Route.get('/listar_chamados_usuarios', 'TicketController.listarChamadosUsuario')
Route.put('/editar_chamado/:id', 'TicketController.update')
Route.delete('/admin/deletar_chamado/:id', 'TicketController.destroy')
Route.get('/admin/listarTicketsPorStatus', 'TicketController.listarTicketsPorStatus')
Route.get('/admin/contar_tickets', 'TicketController.contarTickets')
Route.get('/user/listarTicketsPorStatus', 'TicketController.listarTicketsPorStatusUsuario')
Route.get('/user/contar_tickets', 'TicketController.contarTicketsUsuario')

// Rotas para visualização de tickets atribuido e criados
Route.get('/user/listarTicketsCriados', 'TicketController.listarTicketsCriados')
Route.get('/user/listarTicketsAtribuidos', 'TicketController.listarTicketsAtribuidos')
