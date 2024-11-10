<template>
  <v-container fluid class="main-container">
    <h1 class="title">Relatórios de Chamados</h1>

    <v-toolbar flat class="no-background" style="padding-right: 0px;">
      <v-text-field v-model="search" label="Pesquisar" append-icon="mdi-magnify" single-line hide-details
        class="search-input" />
      <v-spacer></v-spacer>

      <v-menu v-model="startDateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
        <template v-slot:activator="{ on }">
          <v-text-field style="padding-top: 21px;" v-model="startDate" label="Data Inicial" prepend-icon="mdi-calendar"
            readonly v-on="on" class="date-filter" />
        </template>
        <v-date-picker v-model="startDate" @input="startDateMenu = false" />
      </v-menu>

      <v-menu v-model="endDateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
        <template v-slot:activator="{ on }">
          <v-text-field style="padding-top: 21px;" v-model="endDate" label="Data Final" prepend-icon="mdi-calendar"
            readonly v-on="on" class="date-filter" />
        </template>
        <v-date-picker v-model="endDate" @input="endDateMenu = false" />
      </v-menu>
      <template>
        <v-tooltip bottom>
          <!-- Definindo o botão como ativador do tooltip -->
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="my-button" v-bind="attrs" v-on="on" @click="limparFiltros" color="light-blue" dark
              style="height: 35px; width: 35px; margin-left: 20px;">
              <v-img :src="borrachaImage" contain height="25" width="25"></v-img>
            </v-btn>
          </template>
          <!-- Texto do tooltip que aparece ao dar hover -->
          <span style="font-size: smaller;">Limpar Filtros</span>
        </v-tooltip>
      </template>
    </v-toolbar>

    <v-data-table :headers="headers" :items="filteredTickets" class="data-table elevation-1" :search="search">
      <template v-slot:top>
        <v-toolbar flat class="header-background">
          <v-toolbar-title class="white--text">Lista de Chamados</v-toolbar-title>
          <v-spacer></v-spacer>

          <template>
            <v-tooltip bottom>
              <!-- Definindo o botão como ativador do tooltip -->
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="my-button" v-bind="attrs" v-on="on" @click="carregarChamados" color="light-blue" dark
                  style="height: 35px; width: 35px;">
                  <v-img :src="refreshImage" contain height="25" width="25"></v-img>
                </v-btn>
              </template>
              <!-- Texto do tooltip que aparece ao dar hover -->
              <span style="font-size: smaller;">Atualizar lista</span>
            </v-tooltip>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:item.data_criacao="{ item }">
        {{ new Date(item.data_criacao).toLocaleDateString('pt-BR') }}
      </template>

      <template v-slot:footer.prepend>
        <template>
          <v-tooltip bottom>
            <!-- Definindo o botão como ativador do tooltip -->
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="my-button" v-bind="attrs" v-on="on" @click="downloadXLSX" color="light-blue" dark
                style="height: 35px; width: 35px;">
                <v-img :src="relatorioImage" contain height="25" width="25"></v-img>
              </v-btn>
            </template>
            <!-- Texto do tooltip que aparece ao dar hover -->
            <span style="font-size: smaller;">Baixar Relatório</span>
          </v-tooltip>
        </template>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      tickets: [],
      headers: [
        { text: 'Título', value: 'titulo' },
        { text: 'Descrição', value: 'descricao' },
        { text: 'Data de Criação', value: 'data_criacao' },
        { text: 'Responsável', value: 'responsavel' },
        { text: 'Status', value: 'status' },
        { text: 'Prioridade', value: 'prioridade' }
      ],
      search: '',
      userRole: this.$store.state.user.tipo,
      emailLogado: this.$store.state.user.email,
      startDateMenu: false,
      endDateMenu: false,
      startDate: null,
      endDate: null,
      refreshImage: require('../imagens/refresh.png'),
      borrachaImage: require('../imagens/borracha.png'),
      relatorioImage: require('../imagens/download.png'),
    };
  },
  computed: {
    filteredTickets() {
      return this.tickets.filter(ticket => {
        const matchSearch = ticket.titulo.toLowerCase().includes(this.search.toLowerCase()) ||
          ticket.descricao.toLowerCase().includes(this.search.toLowerCase());

        const ticketDate = new Date(ticket.data_criacao);
        const startDateMatch = this.startDate ? ticketDate >= new Date(this.startDate) : true;
        const endDateMatch = this.endDate ? ticketDate <= new Date(this.endDate) : true;

        return matchSearch && startDateMatch && endDateMatch;
      });
    }
  },
  methods: {
    async carregarChamados() {
      try {
        let url = ''
        let objRequest = {}

        url = 'http://127.0.0.1:3333/acompanhar_chamados'
        objRequest = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            responsavel: this.emailLogado,
            tipo: this.userRole,
          }
        }
        const response = await axios.get(url, objRequest);
        this.tickets = response.data;
      } catch (error) {
        console.error('Erro ao carregar chamados:', error);
      }
    },
    filtrarChamados() {
      return this.tickets.filter(ticket => {
        const matchSearch = ticket.titulo.toLowerCase().includes(this.search.toLowerCase()) ||
          ticket.descricao.toLowerCase().includes(this.search.toLowerCase());

        const ticketDate = new Date(ticket.data_criacao);
        const startDateMatch = this.startDate ? ticketDate >= new Date(this.startDate) : true;
        const endDateMatch = this.endDate ? ticketDate <= new Date(this.endDate) : true;

        return matchSearch && startDateMatch && endDateMatch;
      });
    },

    async limparFiltros() {
      this.startDate = null
      this.endDate = null
      this.search = ''
    },

    async parseChamado() {
      let listaXLSX = []

      const chamados = await this.filtrarChamados();

      chamados.forEach(item => {
        listaXLSX.push({
          "idChamado": item.id,
          "CriadoPor": item.nomeC,
          "AtribuidoPara": item.nomeA,
          "Setor": item.setorC,
          "HierarquiaCriado": item.tipoC,
          "HierarquiaAtribuido": item.tipoA,
          "DataCriacao": item.data_criacao,
          "Categoria": "MP",
          "Sla": item.tempo_execucao,
        })
      })
      return listaXLSX
    },

    async downloadXLSX() {
      const parsedChamado = await this.parseChamado()
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(parsedChamado);
      const name = "Excel_Tickets"

      XLSX.utils.book_append_sheet(wb, ws, 'F_Tickets');
      XLSX.utils.book_append_sheet(wb, ws, 'D_Setores');
      XLSX.utils.book_append_sheet(wb, ws, 'D_Hierarquia');
      XLSX.utils.book_append_sheet(wb, ws, 'D_Categoria');
      XLSX.utils.book_append_sheet(wb, ws, 'D_SLA');


      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }

      const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.href = url;
      a.download = name + '.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  },
  async created() {
    this.carregarChamados();
  }
};
</script>

<style scoped>
.no-background {
  background-color: transparent !important;
}

.header-background {
  background-color: #222222 !important;
}

.white--text {
  color: white;
}

.my-button:hover {
  background-color: #0057c1 !important;
}

.my-button:active {
  background-color: #0057c1 !important;
  transform: scale(0.95) !important;
}
</style>