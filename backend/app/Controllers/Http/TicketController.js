'use strict'

const Ticket = use('App/Models/Ticket')
const User = use('App/Models/User')
const UserAdmin = use('App/Models/UserAdmin')
const jwt = require('jsonwebtoken')

class TicketController {

  /**
   * Verifica o token JWT
   */
  async verificarToken(request) {
    const authHeader = request.header('Authorization')
    if (!authHeader) {
      throw new Error('Token não fornecido')
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      throw new Error('Token inválido')
    }

    try {
      const secretKey = process.env.JWT_SECRET || 'your_secret_key'
      return jwt.verify(token, secretKey)
    } catch (error) {
      throw new Error('Token inválido')
    }
  }

  /**
   * Criar um novo ticket
   */
  async store({ request, response }) {
    try {
      const verified = await this.verificarToken(request)

      const { titulo, descricao, atribuido_para, responsavel, tempo_execucao, status } = request.only([
        'titulo', 'descricao', 'atribuido_para', 'responsavel', 'tempo_execucao', 'status'
      ])

      // Verifica se o usuário atribuído existe
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
      console.error('Erro ao criar ticket:', error)
      return response.status(400).json({ error: error.message })
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

  /**
   * Listar chamados atribuídos ou responsáveis
   */
  async listarChamadosUsuario({ request, response }) {
    try {
      const verified = await this.verificarToken(request)
      const email = verified.email // Assumindo que o email está no payload do token

      const chamados = await Ticket.query()
        .where('responsavel', email)
        .orWhere('atribuido', email)
        .fetch()

      return response.status(200).json(chamados)
    } catch (error) {
      console.error('Erro ao listar chamados do usuário:', error)
      return response.status(400).json({ error: error.message })
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

  /**
   * Contar tickets por status
   */
  async contarTickets({ response }) {
    try {
      const emAndamento = await Ticket.query().where('status', 'Em Andamento').getCount()
      const emProducao = await Ticket.query().where('status', 'Em Produção').getCount()
      const backlog = await Ticket.query().where('status', 'Backlog').getCount()

      return response.status(200).json({
        emAndamento,
        emProducao,
        backlog,
      })
    } catch (error) {
      console.error('Erro ao contar tickets:', error)
      return response.status(500).json({ error: 'Erro ao contar tickets' })
    }
  }

  /**
   * Listar tickets por status
   */
  async listarTicketsPorStatus({ request, response }) {
    try {
      const verified = await this.verificarToken(request);
      const status = request.get().status; // Obtendo o status do parâmetro de consulta
  
      console.log('Status recebido:', status); // Log para depuração
  
      if (!status) {
        return response.status(400).json({ error: 'Status não fornecido' });
      }
  
      const tickets = await Ticket.query().where('status', status).fetch();
  
      return response.status(200).json(tickets);
    } catch (error) {
      console.error('Erro ao listar tickets por status:', error);
      return response.status(400).json({ error: error.message });
    }
  }
   /**
   * Contar tickets por status para um usuário
   */
   async contarTicketsUsuario({ request, response }) {
    try {
      const verified = await this.verificarToken(request)
      const email = verified.email

      const emAndamento = await Ticket.query()
        .where((builder) => {
          builder.where('responsavel', email).orWhere('atribuido', email)
        })
        .where('status', 'Em Andamento')
        .getCount()

      const emProducao = await Ticket.query()
        .where((builder) => {
          builder.where('responsavel', email).orWhere('atribuido', email)
        })
        .where('status', 'Em Produção')
        .getCount()

      const backlog = await Ticket.query()
        .where((builder) => {
          builder.where('responsavel', email).orWhere('atribuido', email)
        })
        .where('status', 'Backlog')
        .getCount()

      return response.status(200).json({
        emAndamento,
        emProducao,
        backlog,
      })
    } catch (error) {
      console.error('Erro ao contar tickets do usuário:', error)
      return response.status(500).json({ error: 'Erro ao contar tickets do usuário' })
    }
  }

  /**
   * Listar tickets por status para um usuário
   */
  async listarTicketsPorStatusUsuario({ request, response }) {
    try {
      const verified = await this.verificarToken(request)
      const email = verified.email
      const status = request.get().status

      if (!status) {
        return response.status(400).json({ error: 'Status não fornecido' })
      }

      const tickets = await Ticket.query()
        .where((builder) => {
          builder.where('responsavel', email).orWhere('atribuido', email)
        })
        .where('status', status)
        .fetch()

      return response.status(200).json(tickets)
    } catch (error) {
      console.error('Erro ao listar tickets do usuário por status:', error)
      return response.status(400).json({ error: error.message })
    }
  }
  
  /**
   * Listar tickets criados por um usuário
   */
  async listarTicketsCriados({ request, response }) {
    try {
      const verified = await this.verificarToken(request);
      const email = verified.email;

      const tickets = await Ticket.query()
        .where('responsavel', email)
        .fetch();

      return response.status(200).json(tickets);
    } catch (error) {
      console.error('Erro ao listar tickets criados pelo usuário:', error);
      return response.status(400).json({ error: error.message });
    }
  }

  /**
   * Listar tickets atribuídos a um usuário
   */
  async listarTicketsAtribuidos({ request, response }) {
    try {
      const verified = await this.verificarToken(request);
      const email = verified.email;

      const tickets = await Ticket.query()
        .where('atribuido', email)
        .fetch();

      return response.status(200).json(tickets);
    } catch (error) {
      console.error('Erro ao listar tickets atribuídos ao usuário:', error);
      return response.status(400).json({ error: error.message });
    }
  }
}

module.exports = TicketController
