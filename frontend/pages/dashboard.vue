<template>
    <v-container fluid>
        <v-text-field class="barra-filtro" v-model="search" label="Pesquisar" outlined single-line
            hide-details></v-text-field>
        <v-row>
            <v-col class="coluna">
                <v-card class="v-titulo">
                    <v-card-title>Tickets em Backlog</v-card-title>
                </v-card>
                <v-card class="v-tickets">
                    <v-card link class='card-tickets' @click="abrirDetalhes(ticket)" v-for="ticket in ticketBacklog">
                        <v-card-title>{{ ticket.titulo }}</v-card-title>
                    </v-card>
                </v-card>
            </v-col>
            <v-col class="coluna">
                <v-card class="v-titulo">
                    <v-card-title>Tickets em Andamento</v-card-title>
                </v-card>
                <v-card class="v-tickets">
                    <v-card link class='card-tickets' @click="abrirDetalhes(ticket)" v-for="ticket in ticketAndamento">
                        <v-card-title>{{ ticket.titulo }}</v-card-title>
                    </v-card>
                </v-card>
            </v-col>
            <v-col class="coluna">
                <v-card class="v-titulo">
                    <v-card-title>Tickets Finalizados</v-card-title>
                </v-card>
                <v-card class="v-tickets">
                    <v-card link class='card-tickets' @click="abrirDetalhes(ticket)" v-for="ticket in ticketFinalizado">
                        <v-card-title>{{ ticket.titulo }}</v-card-title>
                    </v-card>
                </v-card>
            </v-col>
        </v-row>


    <v-dialog v-model="dialog" max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Detalhes do Ticket</span>
            </v-card-title>
            <v-card-text>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Título: {{ ticketDetails.titulo }}</v-list-item-title>
                        <v-list-item-subtitle>Descrição: {{ ticketDetails.descricao }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Responsável: {{ ticketDetails.responsavel }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Atribuído: {{ ticketDetails.atribuido }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Status: {{ ticketDetails.status }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Tempo de Execução: {{ ticketDetails.tempo_execucao }}
                            horas</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-card-text>
            <v-card-actions style="display: flex; justify-content: right;">
                <v-btn text @click="dialog = false">Fechar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</v-container>

</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            tickets: [],
            search: '',
            dialog: false,
            userRole: this.$store.state.user.tipo,
            emailLogado: this.$store.state.user.email,
            ticketDetails: {},
            ticketBacklog: [],
            ticketAndamento: [],
            ticketFinalizado: [],
            headers: [
                { text: 'Título', value: 'titulo' },
                { text: 'Responsável', value: 'responsavel' },
                { text: 'Ações', value: 'actions', sortable: false },
            ],
            mostrarAviso: false, // Adicionado para controlar o aviso
        };
    },
    async created() {
        await this.carregarChamados();
    },
    methods: {
        async carregarChamados() {
            try {
                let url = ''
                let objRequest = {}

                if (this.userRole == 1) {
                    url = 'http://127.0.0.1:3333/admin/acompanhar_chamados'
                    objRequest = {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                } else {
                    url = 'http://127.0.0.1:3333/user/acompanhar_chamados'
                    objRequest = {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                        params: {
                            responsavel: this.emailLogado
                        }
                    }
                }
                const response = await axios.get(url, objRequest);
                const chamados = response.data;

                this.ticketBacklog = chamados.filter((chamado) => chamado['status'] == 'Backlog');

                this.ticketAndamento = chamados.filter((chamado) => chamado['status'] == 'Andamento');

                this.ticketFinalizado = chamados.filter((chamado) => chamado['status'] == 'Finalizado');

            } catch (error) {
                console.error('Erro ao carregar chamados:', error);
            }
        },
        abrirDetalhes(ticket) {
            this.ticketDetails = ticket;
            this.dialog = true;
        },
    },
};
</script>

<style scoped>
.v-titulo {
    height: 10%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.v-tickets {
    height: 90%;
    margin-top: 5px;
}

.barra-filtro {
    margin-bottom: 5px;
    background-color: #464646;
    border-radius: 8px;
}

.coluna {
    height: 750px;
}
</style>