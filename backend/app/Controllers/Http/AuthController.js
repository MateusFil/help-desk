'use strict'

const User = use('App/Models/User')
const UserAdmin = use('App/Models/UserAdmin')
const Token = use('App/Models/Token')
const RevokedToken = use('App/Models/RevokedToken')
const Hash = use('Hash')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

class AuthController {

  async loginView({ view }) {
    // Renderiza a página de login
    return view.render('loginView')
  }
  /**
 * Login
 */
  async login({ request, response }) {
    const { email, password } = request.all();
    try {
      // Verifique primeiro na tabela de usuários comuns
      let user = await User.query().where('email', email).first();

      // Se não encontrado, verifique na tabela de administradores
      if (!user) {
        user = await UserAdmin.query().where('email', email).first();
      }

      if (!user || !(await Hash.verify(password, user.password))) {
        return response.status(401).json({ error: 'Usuário ou senha incorretos' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email, tipo: user.tipo }, 'your_secret_key', { expiresIn: '1h' });
       
       // Retorne o token, o tipo de usuário e uma mensagem de sucesso
      return response.json({
        message: 'Login realizado com sucesso!',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          tipo: user.tipo
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return response.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  /**
   * Logout
  */
  async logout({ request, response, auth }) {
    const token = request.header('Authorization').replace('Bearer ', '')
    
    try {
      // Adiciona o token à lista negra
      await RevokedToken.create({ token })
      
      return response.json({ message: 'Logout realizado com sucesso' })
    } catch (error) {
      return response.status(500).json({ message: 'Erro ao processar logout' })
    }
  }

  async isTokenRevoked(token) {
    const tokenRecord = await RevokedToken.query().where('token', token).first();
    return !!tokenRecord;
  }

  /**
   * Autenticacao JWT
  */
  async authenticateToken({ request, response, next }) {
    const authHeader = request.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return response.status(401).json({ error: 'Acesso negado' });

    if (await this.isTokenRevoked(token)) {
      return response.status(401).json({ error: 'Token inválido (revogado)' });
    }

    try {
      const verified = jwt.verify(token, 'your_secret_key');
      request.user = verified;
      return next();
    } catch (err) {
      console.error('Token inválido:', err);
      return response.status(400).json({ error: 'Token inválido' });
    }
  }
}

module.exports = AuthController;
