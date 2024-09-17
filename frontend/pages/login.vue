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
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
  async login() {
    try {
      const response = await this.$axios.post('/login', {
        email: this.email,
        password: this.password
      });

      // Verificar e armazenar o token
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        this.$store.commit('SET_TOKEN', token);
      } else {
        console.error('Token not found in response');
      }

      // Armazenar o usuário no store
      this.$store.commit('SET_USER', response.data.user);
      const userRole = response.data.user.tipo;

      // Redirecionar com base no tipo de usuário
      if (userRole === 1) {
        await this.$router.push('/Dashboard_Admin');
      } else if (userRole === 2) {
        await this.$router.push('/Dashboard_User');
      }
    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  }
}
}
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: auto;
}
</style>
