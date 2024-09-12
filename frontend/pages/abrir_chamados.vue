<template>
  <div class="abrir-chamado">
    <h2>Abrir Chamado</h2>
    <v-form ref="form" v-model="valid" @submit.prevent="submitChamado">
      <v-text-field
        label="Título"
        v-model="chamado.titulo"
        :rules="[rules.required]"
        required
      />
      <v-textarea
        label="Descrição"
        v-model="chamado.descricao"
        :rules="[rules.required]"
        required
      />
      <v-select
        label="Atribuído para"
        :items="usuarios"
        item-text="nome_completo" 
        item-value="email" 
        v-model="chamado.atribuido_para"
        :rules="[rules.required]"
        required
      />
      <v-text-field
        label="Responsável"
        v-model="chamado.responsavel"
        :rules="[rules.required]"
        required
        readonly
      />
      <v-text-field
        label="Tempo de execução (Horas)"
        v-model="chamado.tempo_execucao"
        :rules="[rules.required, rules.number]"
        required
        type="number"
      />
      <v-select
        label="Status"
        :items="statusOptions"
        v-model="chamado.status"
        :rules="[rules.required]"
        required
      />
      <v-btn type="submit" :disabled="!valid">Abrir Chamado</v-btn>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      chamado: {
        titulo: '',
        descricao: '',
        atribuido_para: '',  // E-mail do usuário atribuído
        responsavel: '',    // E-mail do responsável, preenchido automaticamente
        tempo_execucao: '',
        status: '',
      },
      usuarios: [],
      statusOptions: ['Backlog', 'Em Andamento', 'Em Produção'],
      valid: false,
      rules: {
        required: value => !!value || 'Campo obrigatório',
        number: value => !isNaN(parseFloat(value)) || 'Deve ser um número válido',
      },
    };
  },
  async created() {
    await this.carregarUsuarios();
    this.setarResponsavel();
  },
  methods: {
    async carregarUsuarios() {
      try {
        const response = await axios.get('http://127.0.0.1:3333/listar_usuarios', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('Usuários carregados:', response.data); // Verifique o formato dos dados
        this.usuarios = response.data; 
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    },
    setarResponsavel() {
      // Verifica se o usuário está salvo na store do Vuex
      const user = this.$store.state.user || JSON.parse(localStorage.getItem('user'));
      if (user && user.email) {
        this.chamado.responsavel = user.email; // Preenchendo o campo automaticamente
      } else {
        console.warn('E-mail do usuário não encontrado na store ou localStorage');
      }
    },
    async submitChamado() {
      if (this.$refs.form.validate()) {
        try {
          const response = await axios.post('http://127.0.0.1:3333/abrir_chamado', this.chamado, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          alert('Chamado aberto com sucesso!');
          // Limpar o formulário após sucesso
          this.chamado = {
            titulo: '',
            descricao: '',
            atribuido_para: '',
            responsavel: '',
            tempo_execucao: '',
            status: '',
          };
        } catch (error) {
          console.error('Erro ao abrir chamado:', error.response ? error.response.data : error.message);
          alert(`Erro ao abrir chamado: ${error.response ? error.response.data.error : error.message}`);
        }
      }
    },
  },
};
</script>

<style scoped>
.abrir-chamado {
  padding: 1rem;
}
</style>
