<template>
  <div class="register-page">
    <div class="form-container">
      <h2>Registrar</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="nome_completo">Nome Completo:</label>
          <input type="text" id="nome_completo" v-model="nome_completo" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="tipo">Tipo de Usuário:</label>
          <select id="tipo" v-model="tipo" required>
            <option value="1">Administrador</option>
            <option value="2">Usuário Comum</option>
          </select>
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirme a Senha:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nome_completo: '',
      email: '',
      tipo: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert('As senhas não coincidem');
        return;
      }

      try {
        await this.$axios.post('/register', {
          nome_completo: this.nome_completo,
          email: this.email,
          tipo: this.tipo,
          password: this.password,
        });
        alert('Usuário registrado com sucesso!');
        this.$emit('user-registered'); // Emite o evento para notificar o fechamento
      } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário.');
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-container {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

@media (max-width: 600px) {
  .form-container {
    padding: 1rem;
  }
}
</style>
