<template>
  <v-container class="home-page" fluid>
    <!-- Seção de Apresentação da Empresa -->
    <v-card class="company-section">
      <v-card-title class="headline">
        Bem-vindo à Nossa Empresa
      </v-card-title>
      <v-card-subtitle>
        <p>
          Somos uma empresa dedicada a fornecer soluções inovadoras de help desk e gerenciamento de tickets, 
          focada na facilidade de uso para todos os tipos de usuários.
        </p>
      </v-card-subtitle>
      
    </v-card>

    <!-- Seção Interativa da Equipe -->
    <v-card class="team-section">
      <v-card-title class="headline">Conheça a Equipe</v-card-title>
      <v-carousel hide-delimiters>
        <v-carousel-item v-for="(chunk, index) in teamChunks" :key="index">
          <v-row justify="center">
            <v-col v-for="(member, i) in chunk" :key="i" cols="12" md="4" class="text-center">
++              <v-avatar size="120" class="mx-auto mb-3">
                <v-img :src="member.photo" alt="Foto do membro da equipe" />
              </v-avatar>
              <h3>{{ member.name }}</h3>
              <p>{{ member.role }}</p>
              <v-icon small>{{ member.socialIcon }}</v-icon>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-card>

    <!-- Seção de Call-to-Action -->
    <v-card class="cta-section">
      <v-card-title class="headline">Vamos Trabalhar Juntos!</v-card-title>
      <v-card-subtitle>
        <p>
          Entre em contato conosco pelo WhatsApp para saber mais sobre como podemos ajudar sua empresa
          com nossas soluções de help desk.
        </p>
      </v-card-subtitle>
      <v-card-actions class="justify-center">
        <a class="whatsapp-button" href="https://api.whatsapp.com/send/?phone=5515981300905&text=Olá%2C+vim+pelo+site+e+gostaria+de+saber+mais+sobre+suas+soluções.&type=phone_number&app_absent=0" target="_blank">
          <v-btn color="green" icon>
            <v-icon>mdi-whatsapp</v-icon>
            <span class="button-text">Entrar em contato</span>
          </v-btn>
        </a>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      team: [
        { name: 'Bianca Schusarz', role: 'Desenvolvedora', photo: require('@/imagens/bia.jpg'), socialIcon: 'mdi-linkedin' },
        { name: 'Gabriela Panzarini', role: 'Desenvolvedora', photo: require('@/imagens/gabi.jpg'), socialIcon: 'mdi-linkedin' },
        { name: 'Maria Eduarda', role: 'Desenvolvedora', photo: require('@/imagens/duda.jpg'), socialIcon: 'mdi-linkedin' },
        { name: 'Gustavo Aquino', role: 'Desenvolvedor', photo: require('@/imagens/aquino.jpg'), socialIcon: 'mdi-linkedin' },
        { name: 'Mateus Filipe', role: 'Desenvolvedor', photo: require('@/imagens/mateus.jpg'), socialIcon: 'mdi-linkedin' },
      ],
    }
  },
  computed: {
    teamChunks() {
      const chunkSize = 3; // Número de membros por slide
      const chunks = [];
      for (let i = 0; i < this.team.length; i += chunkSize) {
        chunks.push(this.team.slice(i, i + chunkSize));
      }
      return chunks;
    }
  },
}
</script>

<style scoped>
.home-page {
  padding: 2rem;
  background-color: #313131;
}

.company-section, .team-section, .cta-section {
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: #424242;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.company-section p, .cta-section p {
  color: #e0e0e0;
}

.team-section {
  background-color: #323232;
}

.v-avatar {
  background-color: white;
}

.cta-section {
  padding: 1rem;
  background-color: #313131;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.whatsapp-button {
  text-decoration: none;
}

.button-text {
  margin-left: 0.5rem;
}

.justify-center {
  justify-content: center;
}
</style>
