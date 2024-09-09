<template>
  <v-app dark>
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
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="clipped = !clipped"
      >
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn
        icon
        @click.stop="fixed = !fixed"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn
        icon
        @click.stop="rightDrawer = !rightDrawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  computed: {
    menuItems() {
      const user = this.$store.state.user;
      if (user) {
        if (user.tipo === 1) {
          // Itens do menu para administradores
          return [
            { icon: 'mdi-apps', title: 'Dashboard Admin', to: '/Dashboard_Admin' },
            { icon: 'mdi-account-group', title: 'Gerenciar Usuários', to: '/admin/gerenciar_usuario' },
            { icon: 'mdi-ticket', title: 'Abrir Chamados', to: '/admin/abrir_chamados' },
            { icon: 'mdi-eye', title: 'Acompanhar Chamados', to: '/admin/acompanhar_chamados' },
          ];
        } else if (user.tipo === 2) {
          // Itens do menu para usuários comuns
          return [
            { icon: 'mdi-apps', title: 'Dashboard User', to: '/Dashboard_User' },
            { icon: 'mdi-ticket', title: 'Abrir Chamados', to: '/user/abrir_chamados' },
            { icon: 'mdi-eye', title: 'Acompanhar Chamados', to: '/user/acompanhar_chamados' },
          ];
        }
      } else {
        // Itens do menu para visitantes (não logados)
        return [
          { icon: 'mdi-apps', title: 'Home', to: '/' },
          { icon: 'mdi-chart-bubble', title: 'Login', to: '/login' }
        ];
      }
    }
  }
}
</script>
