<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="handleLogout">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <!-- Dialogo de confirmação de inatividade -->
    <v-dialog v-model="inatividadeDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Sessão Expirada</v-card-title>
        <v-card-text>
          <span>Você foi inativo por mais de 5 minutos. Deseja continuar?</span>
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="continuarSessao">Continuar</v-btn>
          <v-btn color="red" @click="fazerLogout">Fazer Logout</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      title: 'Vuetify.js',
      inatividadeDialog: false,
      inatividadeTimeout: null,
      fecharDialogTimeout: null, // Novo timeout para fechamento automático do diálogo
    }
  },
  computed: {
    menuItems() {
      const user = this.$store.state.user;
      if (user) {
        if (user.tipo === 1) {
          return [
            { icon: 'mdi-apps', title: 'Dashboard Admin', to: '/dashboard' },
            { icon: 'mdi-account-group', title: 'Gerenciar Usuários', to: '/admin/gerenciar_usuario' },
            { icon: 'mdi-ticket', title: 'Abrir Chamados', to: '/abrir_chamados' },
            { icon: 'mdi-pencil', title: 'Gerenciar Chamados', to: '/acompanhar_chamados' },
            { icon: 'mdi-pencil', title: 'Relatorios', to: '/relatorios' }
          ]
        } else if (user.tipo === 2) {
          return [
            { icon: 'mdi-apps', title: 'Dashboard User', to: '/dashboard' },
            { icon: 'mdi-ticket', title: 'Abrir Chamados', to: '/abrir_chamados' },
            { icon: 'mdi-pencil', title: 'Editar Chamados', to: '/acompanhar_chamados' },
          ]
        } else if (user.tipo === 3) {
          return [
            { icon: 'mdi-apps', title: 'Dashboard Tecnico', to: '/dashboard' },
            { icon: 'mdi-ticket', title: 'Abrir Chamados', to: '/abrir_chamados' },
            { icon: 'mdi-pencil', title: 'Editar Chamados', to: '/acompanhar_chamados' },
          ]
        }
      } else {
        return [
          { icon: 'mdi-apps', title: 'Home', to: '/' },
          { icon: 'mdi-chart-bubble', title: 'Login', to: '/login' }
        ]
      }
    }
  },
  created() {
  if (process.client) {
    this.iniciarMonitoramentoInatividade();
  }
},
methods: {
    iniciarMonitoramentoInatividade() {
      document.body.addEventListener('mousemove', this.resetarTempoInatividade);
      document.body.addEventListener('keypress', this.resetarTempoInatividade);
      this.iniciarTimeoutInatividade();
    },
    resetarTempoInatividade() {
      clearTimeout(this.inatividadeTimeout);
      this.iniciarTimeoutInatividade();
    },
    iniciarTimeoutInatividade() {
      this.inatividadeTimeout = setTimeout(() => {
        this.inatividadeDialog = true;
        this.iniciarFecharDialogTimeout();
      }, 1 * 60 * 1000); // 5 minutos de inatividade
    },
    iniciarFecharDialogTimeout() {
      this.fecharDialogTimeout = setTimeout(() => {
        this.fazerLogout();
      }, 5000); // 5 segundos para fechamento automático
    },
    continuarSessao() {
      this.inatividadeDialog = false;
      clearTimeout(this.fecharDialogTimeout);
      this.resetarTempoInatividade();
    },
    async handleLogout() {
      try {
        console.log('Iniciando processo de logout');
        // Limpeza do localStorage e do token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('LocalStorage limpo com sucesso');
        
        // Chama a mutation para limpar o Vuex
        this.$store.commit('CLEAR_USER_DATA');
        console.log('Dados do Vuex limpos com sucesso');

        // Redirecionamento direto para a página de login
        this.$router.push({ name: 'login' });
        console.log('Redirecionamento para a página de login realizado');
      } catch (error) {
        console.error('Erro durante o logout:', error);
      }

  },
    fazerLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push({ name: 'login' });
      this.inatividadeDialog = false;
      clearTimeout(this.fecharDialogTimeout);
      window.location.reload(); // Atualiza a página após o logout automático
    },
  },
}
  </script>

<style scoped>
/* Estilos restaurados ao padrão do Vuetify */
</style>