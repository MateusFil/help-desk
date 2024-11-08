<template>
  <v-container fluid fill-height>
    <v-layout justify-center align-center>
      <v-flex xs12 sm8 md4>
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>

          <v-card-subtitle>
            <v-text-field
              v-model="email"
              label="Email"
              outlined
              type="email"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              outlined
              type="password"
            ></v-text-field>
          </v-card-subtitle>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="login" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  created() {
    // Verificar se o usuário está logado ao inicializar a página
    if (process.client) {
      const userLoggedIn = Cookies.get('user_logged_in');
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (userLoggedIn && user && token) {
        // Se estiver logado, restaura o estado do usuário e token
        this.$store.commit('SET_USER', JSON.parse(user));
        this.$store.commit('SET_TOKEN', token);
        // Redirecionar para o dashboard ou página principal
        this.$router.push('/dashboard');
      }
    }
  },
  methods: {
    async login() {
      try {
        const response = await this.$axios.post('/login', {
          email: this.email,
          password: this.password,
        });

        const token = response.data.token;
        if (token) {
          this.$store.commit('SET_TOKEN', token);
          if (process.client) {
            localStorage.setItem('token', token);
          }
        }

        // Salve o cookie e localStorage
        if (process.client) {
          Cookies.set('user_logged_in', 'true', { expires: 7 }); // Adicionando cookie para manter o login por 7 dias
          localStorage.setItem('user', JSON.stringify(response.data.user)); // Salve o usuário no localStorage
        }

        // Salvar o usuário no store
        this.$store.commit('SET_USER', response.data.user);

        // Redirecionar para a página principal
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Erro no login:', error);
      }
    }
  }
}
</script>
