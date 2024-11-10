"use strict";

const Ticket = use("App/Models/Ticket");
const User = use("App/Models/User");
//const UserAdmin = use('App/Models/User')
const jwt = require("jsonwebtoken");

class TicketController {
  /**
   * Verifica o token JWT
   */
  async verificarToken(request) {
    const authHeader = request.header("Authorization");
    if (!authHeader) {
      throw new Error("Token não fornecido");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Token inválido");
    }

    try {
      const secretKey = process.env.JWT_SECRET || "your_secret_key";
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new Error("Token inválido");
    }
  }

  /**
   * Criar um novo ticket
   */
  async store({ request, response }) {
    try {
      const verified = await this.verificarToken(request);

      const {
        titulo,
        descricao,
        atribuido_para,
        responsavel,
        tempo_execucao,
        status,
      } = request.only([
        "titulo",
        "descricao",
        "atribuido_para",
        "responsavel",
        "tempo_execucao",
        "status",
      ]);

      // Verifica se o usuário atribuído existe
      let usuarioAtribuido = await User.findBy("email", atribuido_para);
      /*if (!usuarioAtribuido) {
        usuarioAtribuido = await UserAdmin.findBy('email', atribuido_para)
      }*/

      if (!usuarioAtribuido) {
        usuarioAtribuido = "";
      }

      // Cria o ticket com o responsável e o usuário atribuído
      const chamado = await Ticket.create({
        titulo,
        descricao,
        data_criacao: new Date(), // Define a data atual
        responsavel, // Email do responsável enviado pelo frontend
        atribuido: usuarioAtribuido.email, // Email do usuário ou admin atribuído ao ticket
        tempo_execucao,
        status,
      });

      return response.status(201).json(chamado);
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      return response.status(400).json({ error: error.message });
    }
  }

  /**
   * Listar todos os chamados (somente administradores)
   */

  async index({ request, response }) {
    try {
      const { responsavel, tipo } = request.only(["responsavel", "tipo"]);
      const chamadosUser = Ticket.query()
        .join("users as usrC", "tickets.responsavel", "usrC.email")
        .leftJoin("users as usrA", "tickets.atribuido", "usrA.email")
        .select(
          "tickets.*",
          "usrC.email as emailC",
          "usrC.nome_completo as nomeC",
          "usrC.setor as setorC",
          "usrC.tipo as tipoC",
//        -------------------------------
          "usrA.email as emailA",
          "usrA.nome_completo as nomeA",
          "usrA.setor as setorA",
          "usrA.tipo as tipoA",

        );

      if (tipo === "2") {
        chamadosUser.where("responsavel", responsavel);
      } else if (tipo === "3") {
        chamadosUser
          .where("responsavel", responsavel)
          .orWhere("atribuido", responsavel)
          .orWhere("atribuido", null);
      }

      const resposta = (await chamadosUser.fetch());

      return response.status(200).json(resposta);
    } catch (error) {
      console.error("Erro ao listar mensagens no chamado:", error);
      return response.status(400).json({ error: error.message });
    }
  }

  /**
   * Editar um chamado por ID
   */
  async update({ params, request, response }) {
    try {
      const ticketId = params.id;
      const ticket = await Ticket.find(ticketId);

      if (!ticket) {
        return response.status(404).json({ error: "Chamado não encontrado" });
      }
      r;
      const data = request.only([
        "titulo",
        "descricao",
        "atribuido",
        "tempo_execucao",
        "status",
      ]);
      ticket.merge(data);
      await ticket.save();

      return response.status(200).json(ticket);
    } catch (error) {
      console.error("Erro ao editar chamado:", error);
      return response.status(500).json({ error: "Erro ao editar chamado" });
    }
  }
  async updateAtribuido({ params, request, response }) {
    try {
      const ticketId = params.id;
      const ticket = await Ticket.find(ticketId);

      if (!ticket) {
        return response.status(404).json({ error: "Chamado não encontrado" });
      }
      const data = request.only(["atribuido"]);
      ticket.merge(data);
      await ticket.save();

      return response.status(200).json(ticket);
    } catch (error) {
      console.error("Erro ao atribuir usuario:", error);
      return response.status(500).json({ error: "Erro ao atribuir usuario" });
    }
  }

  /**
   * Deletar um chamado por ID
   */
  async destroy({ params, response }) {
    try {
      const ticketId = params.id;
      const ticket = await Ticket.find(ticketId);

      if (!ticket) {
        return response.status(404).json({ error: "Chamado não encontrado" });
      }

      await ticket.delete();

      return response
        .status(200)
        .json({ message: "Chamado deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar chamado:", error);
      return response.status(500).json({ error: "Erro ao deletar chamado" });
    }
  }

  /**
   * Listar usuários atribuíveis (usuários comuns e administrativos)
   */
  async AtribuirUsuario({ response }) {
    try {
      const usuariosComuns = await User.all();
      const allUsers = usuariosComuns.rows.concat(usuariosComuns.rows);

      return response.status(200).json(allUsers);
    } catch (error) {
      console.error("Erro ao listar usuários atribuíveis:", error);
      return response
        .status(500)
        .json({ error: "Erro ao listar usuários atribuíveis" });
    }
  }
}

module.exports = TicketController;
