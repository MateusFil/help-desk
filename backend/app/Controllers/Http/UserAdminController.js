'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')
const jwt = require('jsonwebtoken')

class UserAdminController {

  /**
   * Registrar um novo usuário (Admin, Usuário Comum ou Técnico de TI)
   */
  async register({ request, response }) {
    const { nome_completo, email, tipo, password, setor } = request.all();
  
    // Verificar se todos os campos estão preenchidos
    if (!nome_completo || !email || !tipo || !password || !setor) {
      return response.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
  
    try {
      // Verifique se o usuário já existe
      const existingUser = await User.query().where('email', email).first();
  
      if (existingUser) {
        return response.status(400).json({ error: 'Usuário já existe' });
      }
  
      // Criptografar a senha
      const hashedPassword = await Hash.make(password);
  
      // Diferenciar usuários pelos tipos
      if (parseInt(tipo) === 1) {
        // Usuário Administrador
        await User.create({
          nome_completo,
          email,
          tipo, // Tipo 1: Admin
          password: hashedPassword,
          setor
        });
  
      } else if (parseInt(tipo) === 2) {
        // Usuário Comum
        await User.create({
          nome_completo,
          email,
          tipo, // Tipo 2: Usuário Comum
          password: hashedPassword,
          setor
        });
  
      } else if (parseInt(tipo) === 3) {
        // Técnico de TI
        await User.create({
          nome_completo,
          email,
          tipo, // Tipo 3: Técnico de TI
          password: hashedPassword,
          setor: 'TI' // Forçar setor "TI" para Técnico de TI
        });
  
      } else {
        // Caso seja passado um tipo inválido
        return response.status(400).json({ error: 'Tipo de usuário inválido' });
      }
  
      return response.status(201).json({ message: 'Usuário registrado com sucesso!' });
  
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return response.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  /**
   * Listar usuários (Admin, Usuário Comum e Técnico de TI)
   */
  async listarUsuarios({ response }) {
    try {
      const users = await User.query().select('nome_completo', 'email', 'tipo', 'setor').fetch()
      return response.json(users.toJSON())
    } catch (error) {
      console.error('Erro ao listar usuários:', error)
      return response.status(500).json({ error: 'Erro ao listar usuários' })
    }
  }

  /**
   * Deletar usuário
   */
  async deletarUsuario({ request, response }) {
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

      // Verificar se o usuário logado é um admin (tipo 1)
      if (verified.tipo !== 1) {
        return response.status(403).json({ error: 'Acesso não autorizado' })
      }

      // Obter o email do usuário a ser deletado
      const { email } = request.only(['email'])

      if (!email) {
        return response.status(400).json({ error: 'Email é obrigatório' })
      }

      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(404).json({ error: 'Usuário não encontrado' })
      }

      await user.delete()
      return response.json({ message: 'Usuário deletado com sucesso!' })
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      return response.status(400).json({ error: 'Token inválido ou erro de autorização' })
    }
  }

  /**
   * Atualizar um usuário
   */
  async editarUsuario({ request, response }) {
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

      // Verificar se o usuário logado é um admin (tipo 1)
      if (verified.tipo !== 1) {
        return response.status(403).json({ error: 'Acesso não autorizado' })
      }

      const { email, nome_completo, tipo, password, setor } = request.only(['email', 'nome_completo', 'tipo', 'password', 'setor'])

      if (!email) {
        return response.status(400).json({ message: 'Email é obrigatório' })
      }

      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(404).json({ message: 'Usuário não encontrado' })
      }

      user.nome_completo = nome_completo || user.nome_completo
      user.tipo = tipo !== undefined ? parseInt(tipo) : user.tipo
      user.setor = setor || user.setor

      if (password) {
        user.password = await Hash.make(password)
      }

      await user.save()
      return response.status(200).json({ message: 'Usuário atualizado com sucesso', user })
    } catch (error) {
      console.error('Erro ao verificar token ou atualizar usuário:', error)
      return response.status(400).json({ error: 'Token inválido ou erro ao atualizar usuário' })
    }
  }
}

module.exports = UserAdminController
