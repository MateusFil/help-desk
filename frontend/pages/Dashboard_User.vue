<template>
  <div class="dashboard-user">
    <h2 style="display: flex; justify-content: center;">Dashboard User</h2>
    <v-container>
      <!-- Seção: Tickets Criados -->
      <h3 style="display: flex; justify-content: center; margin-top: 1rem;">Tickets Criados</h3>
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>
              Tickets Criados em Andamento
              <v-spacer></v-spacer>
              <span class="count">{{ ticketCountsCriados.emAndamento }}</span>
            </v-card-title>
            <v-card-actions style="display: flex; justify-content: right;">
              <v-btn @click="visualizarTickets('Em Andamento', 'criados')">Visualizar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>
              Tickets Criados em Produção
              <v-spacer></v-spacer>
              <span class="count">{{ ticketCountsCriados.emProducao }}</span>
            </v-card-title>
            <v-card-actions style="display: flex; justify-content: right;">
              <v-btn @click="visualizarTickets('Em Produção', 'criados')">Visualizar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>
              Tickets Criados Backlog
              <v-spacer></v-spacer>
              <span class="count">{{ ticketCountsCriados.backlog }}</span>
            </v-card-title>
            <v-card-actions style="display: flex; justify-content: right;">
              <v-btn @click="visualizarTickets('Backlog', 'criados')">Visualizar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Seção: Tickets Atribuídos -->
      <h3 style="display: flex; justify-content: center; margin-top: 1rem;">Tickets Atribuídos</h3>
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>
              Tickets Atribuídos em Andamento
              <v-spacer></v-spacer>
              <span class="count">{{ ticketCountsAtribuidos.emAndamento }}</span>
            </v-card-title>
            <v-card-actions style="display: flex; justify-content: right;">
              <v-btn @click="visualizarTickets('Em Andamento', 'atribuido')">Visualizar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>
              Tickets Atribuídos em Produção
              <v-spacer></v-spacer>
              <span class="count">{{ ticketCountsAtribuidos.emProducao }}</span>
            </v-card-title>
            <v-card-actions style="display: flex; justify-content: right;">
              <v-btn @click="visualizarTickets('Em Produção', 'atribuido')">Visualizar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="mx-auto" outlined>
            <v-card-title>
              Tickets Atribuídos Backlog
              <v-spacer></v-spacer>
              <span class="count">{{ ticketCountsAtribuidos.backlog }}</span>
            </v-card-title>
            <v-card-actions style="display: flex; justify-content: right;">
              <v-btn @click="visualizarTickets('Backlog', 'atribuido')">Visualizar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Mensagem de aviso caso não existam tickets -->
      <v-alert v-if="!tickets.length && mostrarAviso" type="info" class="mt-4">
        Nenhum ticket encontrado para essa categoria.
      </v-alert>

      <!-- Tabela para exibir os tickets filtrados -->
      <v-container v-if="tickets.length">
        <v-data-table
          :headers="headers"
          :items="tickets"
          item-key="id"
          class="elevation-1"
          @click:row="abrirDetalhes"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn @click.stop="abrirDetalhes(item)"><v-icon>mdi-eye</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-container>

      <!-- Diálogo para exibir detalhes do ticket -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Detalhes do Ticket</span>
          </v-card-title>
          <v-card-text>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Título: {{ ticketDetails.titulo }}</v-list-item-title>
                <v-list-item-subtitle>Descrição: {{ ticketDetails.descricao }}</v-list-item-subtitle>
                <v-list-item-subtitle>Responsável: {{ ticketDetails.responsavel }}</v-list-item-subtitle>
                <v-list-item-subtitle>Atribuído: {{ ticketDetails.atribuido }}</v-list-item-subtitle>
                <v-list-item-subtitle>Status: {{ ticketDetails.status }}</v-list-item-subtitle>
                <v-list-item-subtitle>Tempo de Execução: {{ ticketDetails.tempo_execucao }} horas</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>
          <v-card-actions style="display: flex; justify-content: right;">
            <v-btn text @click="dialog = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      ticketCountsCriados: {
        emAndamento: 0,
        emProducao: 0,
        backlog: 0,
      },
      ticketCountsAtribuidos: {
        emAndamento: 0,
        emProducao: 0,
        backlog: 0,
      },
      tickets: [],
      dialog: false,
      ticketDetails: {},
      headers: [
        { text: 'Título', value: 'titulo' },
        { text: 'Responsável', value: 'responsavel' },
        { text: 'Ações', value: 'actions', sortable: false },
      ],
      mostrarAviso: false, // Adicionado para controlar o aviso
    };
  },
  async created() {
    await this.carregarContagemTickets();
  },
  methods: {
    async carregarContagemTickets() {
      try {
        // Carregar todos os tickets criados
        const responseCriados = await axios.get('http://127.0.0.1:3333/user/listarTicketsCriados', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.calcularContagemTickets(responseCriados.data, 'criados');

        // Carregar todos os tickets atribuídos
        const responseAtribuidos = await axios.get('http://127.0.0.1:3333/user/listarTicketsAtribuidos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.calcularContagemTickets(responseAtribuidos.data, 'atribuido');
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
      }
    },
    calcularContagemTickets(tickets, tipo) {
      const counts = {
        emAndamento: 0,
        emProducao: 0,
        backlog: 0,
      };

      tickets.forEach(ticket => {
        if (ticket.status === 'Em Andamento') {
          counts.emAndamento++;
        } else if (ticket.status === 'Em Produção') {
          counts.emProducao++;
        } else if (ticket.status === 'Backlog') {
          counts.backlog++;
        }
      });

      if (tipo === 'criados') {
        this.ticketCountsCriados = counts;
      } else if (tipo === 'atribuido') {
        this.ticketCountsAtribuidos = counts;
      }
    },
    async visualizarTickets(status, tipo) {
      try {
        const url = tipo === 'criados'
          ? 'http://127.0.0.1:3333/user/listarTicketsCriados'
          : 'http://127.0.0.1:3333/user/listarTicketsAtribuidos';

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Filtra os tickets pelo status selecionado
        this.tickets = response.data.filter(ticket => ticket.status === status);
        this.mostrarAviso = this.tickets.length === 0; // Mostra aviso se não houver tickets
      } catch (error) {
        console.error('Erro ao visualizar tickets:', error);
      }
    },
    abrirDetalhes(ticket) {
      this.ticketDetails = ticket;
      this.dialog = true;
    },
  },
};
</script>

<style scoped>
.dashboard-user {
  padding: 20px;
}

.v-card-title {
  display: flex;
  align-items: center;
}

.count {
  font-weight: bold;
  color: #1976d2;
}
</style>
