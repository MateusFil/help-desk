'use strict'

const Ticket = use('App/Models/Ticket')
const User = use('App/Models/User')
const UserAdmin = use('App/Models/UserAdmin')
const jwt = require('jsonwebtoken')

class TicketController {
 /**
   * Criar um novo ticket
   */
 async store({ request, response }) {
  const authHeader = request.header('Authorization')
  if (!authHeader) {
    return response.status(401).json({ error: 'Token não fornecido' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return response.status(401).json({ error: 'Acesso negado: token inválido' })
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'your_secret_key'
    const verified = jwt.verify(token, secretKey)

    // Recebe o email do responsável direto do front-end (vindo no request)
    const { titulo, descricao, atribuido_para, responsavel, tempo_execucao, status } = request.only([
      'titulo', 'descricao', 'atribuido_para', 'responsavel', 'tempo_execucao', 'status'
    ])

    // Verifica se o usuário atribuído existe em uma das tabelas
    let usuarioAtribuido = await User.findBy('email', atribuido_para)
    if (!usuarioAtribuido) {
      usuarioAtribuido = await UserAdmin.findBy('email', atribuido_para)
    }

    if (!usuarioAtribuido) {
      return response.status(404).json({ error: 'Usuário atribuído não encontrado' })
    }

    // Cria o ticket com o responsável e o usuário atribuído
    const chamado = await Ticket.create({
      titulo,
      descricao,
      data_criacao: new Date(), // Define a data atual
      responsavel, // Email do responsável enviado pelo frontend
      atribuido: usuarioAtribuido.email, // Email do usuário ou admin atribuído ao ticket
      tempo_execucao,
      status
    })

    return response.status(201).json(chamado)
  } catch (error) {
    console.error('Erro ao verificar token ou ao criar ticket:', error)
    return response.status(400).json({ error: 'Token inválido ou erro ao criar ticket' })
  }
}

  /**
   * Listar todos os chamados (somente administradores)
   */
  async index({ response }) {
    try {
      const chamados = await Ticket.all()
      return response.status(200).json(chamados)
    } catch (error) {
      console.error('Erro ao listar chamados:', error)
      return response.status(500).json({ error: 'Erro ao listar chamados' })
    }
  }

  // listar chamados atribuidos ou responsaveis
  async listarChamadosUsuario({ request, response }) {
    const authHeader = request.header('Authorization');
    if (!authHeader) {
      return response.status(401).json({ error: 'Token não fornecido' });
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      return response.status(401).json({ error: 'Acesso negado: token inválido' });
    }
  
    try {
      const secretKey = process.env.JWT_SECRET || 'your_secret_key';
      const verified = jwt.verify(token, secretKey);
      const email = verified.email; // Assumindo que o email está no payload do token
  
      const chamados = await Ticket.query()
        .where('responsavel', email)
        .orWhere('atribuido', email)
        .fetch();
  
      return response.status(200).json(chamados);
    } catch (error) {
      console.error('Erro ao verificar token ou listar chamados do usuário:', error);
      return response.status(400).json({ error: 'Token inválido ou erro ao listar chamados' });
    }
  }

  /**
   * Editar um chamado por ID
   */
  async update({ params, request, response }) {
    try {
      const ticketId = params.id
      const ticket = await Ticket.find(ticketId)

      if (!ticket) {
        return response.status(404).json({ error: 'Chamado não encontrado' })
      }

      const data = request.only(['titulo', 'descricao', 'atribuido', 'tempo_execucao', 'status'])
      ticket.merge(data)
      await ticket.save()

      return response.status(200).json(ticket)
    } catch (error) {
      console.error('Erro ao editar chamado:', error)
      return response.status(500).json({ error: 'Erro ao editar chamado' })
    }
  }

  /**
   * Deletar um chamado por ID
   */
  async destroy({ params, response }) {
    try {
      const ticketId = params.id
      const ticket = await Ticket.find(ticketId)

      if (!ticket) {
        return response.status(404).json({ error: 'Chamado não encontrado' })
      }

      await ticket.delete()

      return response.status(200).json({ message: 'Chamado deletado com sucesso' })
    } catch (error) {
      console.error('Erro ao deletar chamado:', error)
      return response.status(500).json({ error: 'Erro ao deletar chamado' })
    }
  }
  
   /**
   * Listar usuários atribuíveis (usuários comuns e administrativos)
   */
  async AtribuirUsuario({ response }) {
    try {
      const usuariosComuns = await User.all()
      const usuariosAdmins = await UserAdmin.all()

      const allUsers = usuariosComuns.rows.concat(usuariosAdmins.rows)

      return response.status(200).json(allUsers)
    } catch (error) {
      console.error('Erro ao listar usuários atribuíveis:', error)
      return response.status(500).json({ error: 'Erro ao listar usuários atribuíveis' })
    }
  }
}

module.exports = TicketController
