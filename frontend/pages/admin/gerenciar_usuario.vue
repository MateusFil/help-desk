<template>
  <div class="gerenciar_usuario">
    <div class="header">
      <h2>Gerenciar Usuários</h2>
      <button @click="abrirRegistrarUsuario" class="add-user-button">+ Adicionar Usuário</button>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar por nome ou email"
        class="search-input"
      />
    </div>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Nome</th>
          <th>Email</th>
          <th>Tipo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.email">
          <td>{{ user.nome_completo }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.tipo }}</td>
          <td>
            <button @click="abrirEditarUsuario(user)" class="action-button">Editar</button>
            <button @click="deletarUsuario(user.email)" class="action-button">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Guia Suspensa para Registrar Novo Usuário -->
    <transition name="fade">
      <div v-if="showRegistrarUsuario" class="dropdown">
        <div class="dropdown-content">
          <button class="close-button" @click="fecharRegistrarUsuario">×</button>
          <RegistrarUsuario @user-registered="fecharRegistrarUsuario" />
        </div>
      </div>
    </transition>



    <!-- Guia Suspensa para Editar Usuário -->
    <transition name="fade">
      <div v-if="showEditarUsuario" class="dropdown">
        <div class="dropdown-content">
          <button class="close-button" @click="fecharEditarUsuario">×</button>
          <EditarUsuario
            :user="selectedUser"
            @user-updated="atualizarUsuario"
            @close="fecharEditarUsuario"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';
import EditarUsuario from './editar_usuario.vue';
import RegistrarUsuario from './registrar_usuario.vue';

export default {
  components: {
    RegistrarUsuario,
    EditarUsuario,
  },
  data() {
    return {
      users: [],
      selectedUsers: [],
      showRegistrarUsuario: false,
      showEditarUsuario: false,
      selectedUser: null,
      token: localStorage.getItem('token') || '', 
      searchQuery: '',
    };
  },
  async created() {
    await this.listar_usuarios();
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users;
      }
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(user => 
        user.nome_completo.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async listar_usuarios() {
      try {
        const response = await axios.get('http://127.0.0.1:3333/listar_usuarios', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.users = response.data;
      } catch (error) {
        console.error('List failed:', error.message);
      }
    },

    abrirRegistrarUsuario() {
      this.showRegistrarUsuario = true;
    },

    abrirEditarUsuario(user) {
      this.selectedUser = user;
      this.showEditarUsuario = true;
    },

    fecharRegistrarUsuario() {
      this.showRegistrarUsuario = false;
      this.listar_usuarios();
    },

    fecharEditarUsuario() {
      this.showEditarUsuario = false;
    },

    async atualizarUsuario(user) {
      try {
        await axios.put('http://127.0.0.1:3333/editar_usuario', {
          email: user.email,          
          nome_completo: user.nome_completo,
          tipo: user.tipo,
        }, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.fecharEditarUsuario(); // Fecha a guia após a atualização
        this.listar_usuarios(); // Atualiza a lista de usuários
      } catch (error) {
        console.error('Erro ao atualizar usuário:', error.message);
      }
    },

    async deletarUsuario(email) {
      const confirmar = confirm('Deseja realmente excluir este usuário?');
      if (!confirmar) {
        return; // Cancela a exclusão se o usuário escolher "Não"
      }
      try {
        await axios.delete('http://127.0.0.1:3333/deletar_usuario', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          data: {
            email,
          },
        });
        this.listar_usuarios(); // Atualiza a lista após exclusão
      } catch (error) {
        console.error('Falha ao deletar usuário:', error.message);
      }
    },
  }
}
</script>

<style scoped>
.gerenciar_usuario {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-user-button {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-user-button:hover {
  background-color: #45a049;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}

.action-button {
  background-color: #2196F3;
  color: white;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.action-button:hover {
  background-color: #1976D2;
}
.action-cancel-button {
  background-color: #f44336;
  margin-top: 0.5rem;
}

.cancel-button:hover {
  background-color: #e53935;
}


.dropdown {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dropdown-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
}

.close-button:hover {
  color: #000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
