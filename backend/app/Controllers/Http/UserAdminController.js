'use strict'

const User = use('App/Models/User')
const UserAdmin = use('App/Models/UserAdmin')
const Hash = use('Hash')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

class UserAdminController {

  /**
   * registrar um novo usuário
   */
  async register({ request, response }) {
    const { nome_completo, email, tipo, password } = request.all()

    if (!nome_completo || !email || !tipo || !password) {
      console.log('Campos faltando:', { nome_completo, email, tipo, password })
      return response.status(400).json({ error: 'Todos os campos são obrigatórios' })
    }

    try {
      // Verifique se o usuário já existe em ambas as tabelas
      const existingUser = await User.query().where('email', email).first()
      const existingAdmin = await UserAdmin.query().where('email', email).first()

      if (existingUser || existingAdmin) {
        return response.status(400).json({ error: 'Usuário já existe' })
      }

      const hashedPassword = await Hash.make(password)

      // Se tipo é 1, cria um administrador, caso contrário, cria um usuário comum
      if (parseInt(tipo) === 1) {
        await UserAdmin.create({ nome_completo, email, tipo, password: hashedPassword })
      } else {
        await User.create({ nome_completo, email, tipo, password: hashedPassword })
      }

      return response.status(201).json({ message: 'Usuário registrado com sucesso' })
    } catch (error) {
      console.error('Erro ao registrar usuário:', error)
      return response.status(500).json({ error: 'Erro ao registrar usuário' })
    }
  }

  /**
   * listar usuarios
   */
    async listarUsuarios({ response }) {
    try {
      // Obtenha todos os usuários comuns
      const users = await User.query().select('nome_completo', 'email', 'tipo').fetch()
      
      // Obtenha todos os administradores
      const admins = await UserAdmin.query().select('nome_completo', 'email', 'tipo').fetch()
      console.log(users.toJSON(), admins.toJSON())
      // Combine os resultados
      const allUsers = [...users.toJSON(), ...admins.toJSON()]
      console.log(allUsers)
      // Ordenar os usuários por nome ou outro critério se necessário
      allUsers.sort((a, b) => a.nome_completo.localeCompare(b.nome_completo))
      
      return response.json(allUsers)
    } catch (error) {
      console.error('Erro ao listar usuários:', error)
      return response.status(500).json({ error: 'Erro ao listar usuários' })
    }
  }

  /**
   * Deletar usuario
   */
  async deletarUsuario({ params, request, response }) {
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

    // Verificar se o usuário logado é um admin
    if (verified.tipo !== 1) {
      return response.status(403).json({ error: 'Acesso não autorizado' });
    }

    // Verificar o usuário a ser deletado (agora vindo do corpo da requisição)
    const { email } = request.only(['email']);

    if (!email) {
      return response.status(400).json({ error: 'Email é obrigatório' });
    }

    let user = await User.findBy('email', email);
    if (!user) {
      user = await UserAdmin.findBy('email', email);
    }

    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    await user.delete();

    return response.json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return response.status(400).json({ error: 'Token inválido ou erro de autorização' });
  }
  }

  /**
   * Atualizar um usuário por e-mail
   * PUT /update_user/:email
   */
  async editarUsuario({ request, response }) {
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
  
      // Verificar se o usuário logado é um admin
      if (verified.tipo !== 1) {
        return response.status(403).json({ error: 'Acesso não autorizado' });
      }
  
      // Verificar os dados a serem atualizados
      const { email, nome_completo, tipo, password } = request.only(['email', 'nome_completo', 'tipo', 'password']);
      
      if (!email) {
        return response.status(400).json({ message: 'Email é obrigatório' });
      }
  
      // Procurar o usuário pelo email fornecido
      let user = await User.findBy('email', email);
      if (!user) {
        user = await UserAdmin.findBy('email', email);
      }
  
      if (!user) {
        return response.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Se o tipo for alterado, mova o usuário para a tabela correspondente
      if (parseInt(tipo) === 1 && user instanceof User) {
        // Mover de 'users' para 'users_admin'
        const admin = new UserAdmin();
        admin.nome_completo = nome_completo || user.nome_completo;
        admin.email = user.email;
        admin.tipo = 1;
        admin.password = user.password; // Mantém a senha atual
        await admin.save();
  
        await user.delete();
  
        return response.status(200).json({ message: 'Usuário movido para administradores com sucesso!', user: admin });
      } else if (parseInt(tipo) === 2 && user instanceof UserAdmin) {
        // Mover de 'users_admin' para 'users'
        const newUser = new User();
        newUser.nome_completo = nome_completo || user.nome_completo;
        newUser.email = user.email;
        newUser.tipo = 2;
        newUser.password = user.password; // Mantém a senha atual
        await newUser.save();
  
        await user.delete();
  
        return response.status(200).json({ message: 'Usuário movido para usuários comuns com sucesso!', user: newUser });
      }
  
      // Se não houve mudança de tipo, apenas atualiza os campos
      if (user) {
        user.nome_completo = nome_completo || user.nome_completo;
        user.tipo = tipo !== undefined ? tipo : user.tipo;
  
        // Apenas atualiza a senha se ela foi fornecida, caso contrário mantém a senha atual
        if (password) {
          user.password = await Hash.make(password); // Criptografa a nova senha
        }
  
        await user.save();
        return response.status(200).json({ message: 'Usuário atualizado com sucesso', user });
      }
  
    } catch (error) {
      console.error('Erro ao verificar token ou atualizar usuário:', error);
      return response.status(400).json({ error: 'Token inválido ou erro ao atualizar usuário' });
    }
  }
}

module.exports = UserAdminController
