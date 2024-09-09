'use strict'

const User = use('App/Models/User')
const UserAdmin = use('App/Models/UserAdmin')
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
    console.log(request.all());
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

      const token = jwt.sign({ userId: user.id, tipo: user.tipo }, 'your_secret_key', { expiresIn: '1h' });
      
      // Retorne o token, o tipo de usuário e uma mensagem de sucesso
      return response.json({
        message: 'Login realizado com sucesso!',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          tipo: user.tipo  // Tipo do usuário, 1 para admin e 2 para usuário comum
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return response.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

 /**
   * Autenticacao JWT
   */
  async authenticateToken({ request, response, next }) {
    const authHeader = request.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return response.status(401).json({ error: 'Acesso negado' });
  
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
