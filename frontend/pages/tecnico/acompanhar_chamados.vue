<template>
  <div class="acompanhar-chamados">
    <h2>Acompanhar Chamados</h2>
    <v-data-table
      :headers="headers"
      :items="chamados"
      item-key="id"
      class="elevation-1"
      :search="search"
    >
      <!-- Slot para o conteúdo superior -->
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Lista de Chamados</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" label="Pesquisar" single-line hide-details></v-text-field>
        </v-toolbar>
      </template>

      <!-- Slot para as ações em cada linha -->
      <template #item.actions="{ item }">
        <v-icon small @click="editChamado(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteChamado(item.id)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Edit Chamado Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <div class="title-chamado">
          <v-card-title>
          <span class="headline">Editar Chamado</span>         
        </v-card-title>
        <v-btn class="botaoassumir" text @click="assumirChamado">Assumir Chamado</v-btn>
        </div>
        
        
        

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field label="Título" v-model="editChamadoData.titulo" :rules="[rules.required]" required />
            <v-textarea label="Descrição" v-model="editChamadoData.descricao" :rules="[rules.required]" required />
            <v-text-field label="Tempo de execução (Horas)" v-model="editChamadoData.tempo_execucao" required type="number" />
            <v-select label="Status" :items="statusOptions" v-model="editChamadoData.status" required />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="submitEdit">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      chamados: [],
      usuarios: [],
      search: '',
      dialog: false,
      valid: false,
      editChamadoData: {},
      statusOptions: ['Backlog', 'Em Andamento', 'Em Produção'],
      headers: [
        { text: 'Título', value: 'titulo' },
        { text: 'Atribuído Para', value: 'atribuido' },
        { text: 'Responsável', value: 'responsavel' },
        { text: 'Status', value: 'status' },
        { text: 'Ações', value: 'actions', sortable: false },
      ],
      rules: {
        required: value => !!value || 'Campo obrigatório',
      },
    };
  },
  async created() {
    await this.carregarChamados();
    await this.carregarUsuarios();
  },
  methods: {
    async carregarChamados() {
      try {
        const response = await axios.get('http://127.0.0.1:3333/admin/acompanhar_chamados', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.chamados = response.data;
      } catch (error) {
        console.error('Erro ao carregar chamados:', error);
      }
    },
    async carregarUsuarios() {
      try {
        const response = await axios.get('http://127.0.0.1:3333/atribuir_usuario', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.usuarios = response.data;
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    },
    editChamado(item) {
      this.editChamadoData = { ...item };
      this.dialog = true;
    },
    async submitEdit() {
      if (this.$refs.form.validate()) {
        try {
          await axios.put(
            `http://127.0.0.1:3333/editar_chamado/${this.editChamadoData.id}`,
            this.editChamadoData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          alert('Chamado editado com sucesso!');
          this.dialog = false;
          this.carregarChamados(); // Recarrega a lista de chamados
        } catch (error) {
          console.error('Erro ao editar chamado:', error);
        }
      }
    },
    async assumirChamado() {
      //console.log(this.$store.state.user.email)
      if (confirm('Tem certeza que deseja assumir esse chamado?')) {
        try {
          await axios.put(
            `http://127.0.0.1:3333/editar_atribuido/${this.editChamadoData.id}`,
            {'atribuido': this.$store.state.user.email},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          alert('Chamado editado com sucesso!');
          this.dialog = false;
          this.carregarChamados(); // Recarrega a lista de chamados
        } catch (error) {
          console.error('Erro ao editar chamado:', error);
        }
      }
    },
    async deleteChamado(id) {
      if (confirm('Tem certeza que deseja deletar este chamado?')) {
        try {
          await axios.delete(`http://127.0.0.1:3333/admin/deletar_chamado/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          alert('Chamado deletado com sucesso!');
          this.carregarChamados(); // Recarrega a lista de chamados
        } catch (error) {
          console.error('Erro ao deletar chamado:', error);
        }
      }
    },
    closeDialog() {
      this.dialog = false;
    },
  },
};
</script>

<style scoped>
.acompanhar-chamados {
  padding: 1rem;
  background-color: #313131;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.botaoassumir {
  color: #FFFF;
  background-color: #1976d2;
  position: absolute;
  right: 16px;
  top: 16px;
  padding: 5px;
  
  

}

.title-chamado {
  display: flex;
  width: 100%;
  position: relative;
}

.v-data-table {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.v-toolbar {
  background-color: #1976d2;
  color: rgb(250, 250, 250);
  border-radius: 8px 8px 0 0;
}

.v-text-field,
.v-select,
.v-textarea {
  background-color: rgb(32, 32, 32);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Estilo para a cor do texto e do rótulo do campo de busca */
.v-text-field input {
  color: #1976d2; /* Cor da letra do campo de busca */
}

.v-text-field .v-label {
  color: #000000; /* Cor do rótulo do campo de busca */
}

.v-card {
  border-radius: 8px;
}

.v-btn {
  border-radius: 8px;
}

.v-icon {
  color: #1976d2;
  cursor: pointer;
}

.v-icon:hover {
  color: #1565c0;
}
</style>
