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
    }
  },
  computed: {
    menuItems() {
      const user = this.$store.state.user
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
  methods: {
    async handleLogout() {
      try {
        await this.$store.dispatch('logout')
      } catch (error) {
        console.error('Erro ao realizar logout:', error)
      }
    }
  }
}
</script>

<style scoped>
/* Estilos restaurados ao padrão do Vuetify */
</style>
