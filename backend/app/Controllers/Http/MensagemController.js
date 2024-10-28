"use strict";

const Mensagem = use("App/Models/Mensagem");

class MensagemController {
  async store({ request, response }) {
    try {
      const {
        id_chamado,
        mensagem,
        responsavel,
      } = request.only([
        "id_chamado",
        "mensagem",
        "responsavel",
      ]);


      const chamado = await Mensagem.create({
        id_chamado,
        mensagem,
        responsavel,
      });

      return response.status(201).json(chamado);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return response.status(400).json({ error: error.message });
    }
  }

  async listarMensagemChamado({ request, response }) {
    try {
      const {
        id_chamado,
      } = request.only([
        "id_chamado",
      ]);
      const chamados = await Mensagem.query()
        .where('id_chamado', id_chamado)
        .fetch()

      return response.status(200).json(chamados)
    } catch (error) {
      console.error('Erro ao listar mensagens no chamado:', error)
      return response.status(400).json({ error: error.message })
    }
  }
}


module.exports = MensagemController;
