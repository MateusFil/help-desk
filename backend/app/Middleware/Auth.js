const jwt = require('jsonwebtoken')

class Auth {
  async handle({ request, response, auth }, next) {
    // Obtém o header de autorização
    const authHeader = request.header('Authorization')
    
    // Extrai o token do header
    const token = authHeader && authHeader.split(' ')[1]

    // Se não houver token, retorna erro de acesso negado
    if (!token) {
      return response.status(401).json({ error: 'Acesso negado' })
    }

    try {
      // Verifica o token com a chave secreta
      const verified = jwt.verify(token, 'your_secret_key')
      // Adiciona o usuário verificado ao objeto de solicitação
      request.user = verified

      // Passa o controle para o próximo middleware ou rota
      await next()
    } catch (err) {
      console.error('Token inválido:', err)
      return response.status(400).json({ error: 'Token inválido' })
    }
  }
}

module.exports = Auth
