<template>
    <v-container fluid>
        <v-row>
            <v-col class="coluna">
                <v-card class="v-titulo">
                    <v-card-title>Tickets em Backlog</v-card-title>
                </v-card>
                <v-card class="v-tickets">
                    <v-card link class='card-tickets' @click="abrirDetalhes(ticket)" v-for="ticket in ticketBacklog">
                        <div style="display: flex; justify-content: space-between; padding-right: 0px;">
                            <h6 style="margin-left: 0px;">{{ ticket.responsavel }}</h6>
                            <h6>{{ convertDateFormat(ticket.created_at) }}</h6>
                        </div>
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
                        <div style="display: flex; justify-content: space-between; padding-right: 0px;">
                            <h6 style="margin-left: 0px;">{{ ticket.responsavel }}</h6>
                            <h6>{{ convertDateFormat(ticket.created_at) }}</h6>
                        </div>
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
                        <div style="display: flex; justify-content: space-between; padding-right: 0px;">
                            <h6 style="margin-left: 0px;">{{ ticket.responsavel }}</h6>
                            <h6>{{ convertDateFormat(ticket.created_at) }}</h6>
                        </div>
                        <v-card-title>{{ ticket.titulo }}</v-card-title>
                    </v-card>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="750px" >
            <v-card  style="overflow: hidden; height: 260px;">
                <v-row>
                    <v-col>
                        <v-card-title>
                            <span class="headline">Detalhes do Ticket</span>
                        </v-card-title>
                        <v-card-text>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Título: {{ ticketDetails.titulo }}</v-list-item-title>
                                    <v-list-item-subtitle>Descrição: {{ ticketDetails.descricao
                                        }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>Responsável: {{ ticketDetails.responsavel
                                        }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>Atribuído: {{ ticketDetails.atribuido
                                        }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>Status: {{ ticketDetails.status }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>Prioridade: {{ codPrioridade }}
                                        prioridade</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card-text>
                    </v-col>
                    <v-col style="max-height:606px">
                        <v-card-title>
                            <span class="headline">Progresso do Chamado:</span>
                        </v-card-title>
                        <div class="showMensagens">
                            <div class="title_outterChat" v-for="mensagem in mensagens">
                                <div style="display: flex; justify-content: space-between; padding-right: 0px;">
                                    <h6 style="margin-left: 0px;">{{ convertDateFormat(mensagem.created_at) }}</h6>
                                </div>
                                <v-list-item-subtitle style="margin-bottom: 1px;">{{ mensagem.mensagem }}</v-list-item-subtitle>
                            </div>
                        </div>
                        <v-card-actions style="display: flex; justify-content: right;">
                            <v-btn style="margin-right: 14px;" text @click="dialog = false">Fechar</v-btn>
                        </v-card-actions>

                    </v-col>
                </v-row>
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
            message: {},

            mensagens: [],
            search: '',
            dialog: false,
            userRole: this.$store.state.user.tipo,
            emailLogado: this.$store.state.user.email,
            setorLogado: this.$store.state.user.tipo,
            prioridadeOptions: {
                'BP': 'Baixa',
                'MP': 'Média',
                'AP': 'Alta',
            },
            codPrioridade: '',
            chamados: [],
            ticketDetails: {},
            ticketBacklog: [],
            ticketAndamento: [],
            ticketFinalizado: [],
            headers: [
                { text: 'Título', value: 'titulo' },
                { text: 'Responsável', value: 'responsavel' },
                { text: 'Ações', value: 'actions', sortable: false },
            ],
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

                url = 'http://127.0.0.1:3333/acompanhar_chamados'
                objRequest = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    params: {
                        responsavel: this.emailLogado,
                        tipo: this.userRole
                    }
                }

                const response = await axios.get(url, objRequest);
                console.log('Chamados carregados:', response.data); // Adicione esta linha
                const chamados = response.data;

                this.ticketBacklog = chamados.filter((chamado) => chamado['status'] == 'Backlog');
                this.ticketAndamento = chamados.filter((chamado) => chamado['status'] == 'Andamento');
                this.ticketFinalizado = chamados.filter((chamado) => chamado['status'] == 'Finalizado');
                this.chamados = chamados;
            } catch (error) {
                console.error('Erro ao carregar chamados:', error);
            }
        },
        async carregarMensagens(id_chamado) {
        try {
            let listMensagem;
            const response = await axios.get('http://127.0.0.1:3333/acompanhar_chat', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: { id_chamado }
            });
            listMensagem = response.data;

            this.mensagens = listMensagem.filter((mensage) => mensage['responsavel'] == 'Sistema');
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
        },
        async abrirDetalhes(ticket) {
            this.ticketDetails = ticket;
            this.dialog = true;
            this.codPrioridade = this.prioridadeOptions[this.ticketDetails.prioridade];


            await this.carregarMensagens(ticket.id);
        },
        convertDateFormat(dateStr) {
            const [datePart, timePart] = dateStr.split(' ');
            const [day, month, year] = datePart.split('-');
            const [hour, minute] = timePart.split(':');
            return `${day}/${month}/${year} ${hour}:${minute}`;
        },
    }
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
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3px;
    overflow-x: hidden;
    overflow-y: auto;
}

.barra-filtro {
    margin-bottom: 5px;
    background-color: #464646;
    border-radius: 8px;
}

.coluna {
    height: 750px;
}

.showMensagens {
    height: 140px;
    overflow-y: auto;
    overflow-x: hidden;
    align-self: center;
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
}

.card-tickets {
    width: 95%;
    padding: 5px;
    box-shadow: 5px 5px 10px 10px #464646;
    background-color: #2e2e2e;
    margin: 2px;
}
</style>
