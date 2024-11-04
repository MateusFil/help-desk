<template>
    <v-container fluid class="main-container">
      <h1 class="title">Relatórios de Chamados</h1>
  
      <v-toolbar flat class="no-background">
        <v-text-field
          v-model="search"
          label="Pesquisar"
          append-icon="mdi-magnify"
          single-line
          hide-details
          class="search-input"
        />
        <v-spacer></v-spacer>
        
        <v-menu
          v-model="startDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="startDate"
              label="Data Inicial"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
              class="date-filter"
            />
          </template>
          <v-date-picker
            v-model="startDate"
            @input="startDateMenu = false"
          />
        </v-menu>
  
        <v-menu
          v-model="endDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="endDate"
              label="Data Final"
              prepend-icon="mdi-calendar"
              readonly
              v-on="on"
              class="date-filter"
            />
          </template>
          <v-date-picker
            v-model="endDate"
            @input="endDateMenu = false"
          />
        </v-menu>
      </v-toolbar>
  
      <v-data-table
        :headers="headers"
        :items="filteredTickets"
        class="data-table elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat class="header-background">
            <v-toolbar-title class="white--text">Lista de Chamados</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="carregarChamados" color="light-blue" dark>
              <v-img :src="refreshImage" contain height="30" width="30"></v-img>
            </v-btn>
          </v-toolbar>
        </template>
  
        <template v-slot:item.data_criacao="{ item }">
          {{ new Date(item.data_criacao).toLocaleDateString('pt-BR') }}
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script>
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
        startDateMenu: false,
        endDateMenu: false,
        startDate: null,
        endDate: null,
        refreshImage: require('../imagens/Refresh.png')
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
          const response = await this.$axios.get('http://127.0.0.1:3333/admin/acompanhar_chamados', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          this.tickets = response.data;
          console.log('Chamados carregados:', this.tickets);
        } catch (error) {
          console.error('Erro ao carregar os chamados:', error);
        }
      }
    },
    mounted() {
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
    padding: 10px;
  }
  .white--text {
    color: white;
  }
  </style>
  