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
        <v-card-title>
          <span class="headline">Editar Chamado</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field label="Título" v-model="editChamadoData.titulo" :rules="[rules.required]" required />
            <v-textarea label="Descrição" v-model="editChamadoData.descricao" :rules="[rules.required]" required />
            <v-select
              label="Atribuído para"
              :items="usuarios"
              item-text="nome_completo"
              item-value="email"
              v-model="editChamadoData.atribuido"
              :rules="[rules.required]"
              required
            />
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
}
</style>
