<template>
  <div class="edit-page">
    <div class="form-container">
      <h2>Editar Usuário</h2>
      <form @submit.prevent="atualizarUsuario">
        <div class="form-group">
          <label for="nome_completo">Nome Completo:</label>
          <input v-model="user.nome_completo" type="text" id="nome_completo" required />
        </div>
        
        <div class="form-group">
          <label for="tipo">Tipo de Usuário:</label>
          <select v-model="user.tipo" id="tipo" required>
            <option value="1">Administrador</option>
            <option value="2">Usuário Comum</option>
          </select>
        </div>
        <div class="form-group">
        <label for="setor">Setor:</label>
        <select id="setor" v-model="user.setor" required>
          <option value="TI">TI</option>
          <option value="RH">RH</option>
          <option value="ADM">ADM</option>
          <option value="FINANCEIRO">FINANCEIRO</option>
          <option value="ESTOQUE">ESTOQUE</option>
          <option value="PRODUCAO">PRODUCAO</option>
        </select>
      </div>

        <button type="submit">Salvar</button>
        <button @click.prevent="cancelarEdicao" class="cancel-button">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object, // Recebe os dados do usuário selecionado
  },
  methods: {
    atualizarUsuario() {
      this.$emit('user-updated', this.user); // Dispara o evento para atualizar o usuário no componente pai
    },
    cancelarEdicao() {
      this.$emit('close'); // Emite o evento 'close' para o componente pai
    },
  },
};
</script>

<style scoped>
.edit-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: rgb(32, 32, 32);
  border-radius: 8px;

}

.form-container {
  background-color: rgb(32, 32, 32);
  padding: 2rem;
  font-size: 1.0rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h2 {
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #ffffff;
  font-weight: bold;
}

input[type="text"],
select {
  background-color: #242323;
  color: #ffffff;;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ffffff;
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

.cancel-button {
  background-color: #f44336;
  margin-top: 0.5rem;
}

.cancel-button:hover {
  background-color: #e53935;
}

@media (max-width: 600px) {
  .form-container {
    padding: 1rem;
  }
}
</style>
