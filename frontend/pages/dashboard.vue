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


        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
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
import * as XLSX from 'xlsx';

export default {
    data() {
        return {
            tickets: [],
            search: '',
            dialog: false,
            userRole: this.$store.state.user.tipo,
            emailLogado: this.$store.state.user.email,
            setorLogado: this.$store.state.user.tipo,
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

                this.chamados = chamados
            } catch (error) {
                console.error('Erro ao carregar chamados:', error);
            }
        },
        abrirDetalhes(ticket) {
            this.ticketDetails = ticket;
            this.dialog = true;
        },
        convertDateFormat(dateStr) {
            // Separa a data e a hora
            const [datePart, timePart] = dateStr.split(' ');

            // Divide a parte da data e a hora
            const [day, month, year] = datePart.split('-');
            const [hour, minute] = timePart.split(':');

            // Retorna no novo formato
            return `${day}/${month}/${year} ${hour}:${minute}`;
        },
        parseChamado() {
            let listaXLSX = []

            this.chamados.forEach(item => {
                listaXLSX.push({
                    "idChamado": item.id,
                    "CriadoPor": item.nomeC,
                    "AtribuidoPara": item.nomeA,
                    "Setor": item.setorC,
                    "HierarquiaAtribuido": item.tipoA,
                    "DataCriacao": item.data_criacao,
                    "Categoria": "MP",
                    "Sla": item.tempo_execucao,
                })
            })
            return listaXLSX
        },

        downloadXLSX() {
            const parsedChamado = this.parseChamado()
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(parsedChamado);
            const name = "F_Tickets"

            XLSX.utils.book_append_sheet(wb, ws, 'Planilha');

            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            function s2ab(s) {
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            document.body.appendChild(a);
            a.href = url;
            a.download = name + '.xlsx';
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    }
}
    ;
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

.card-tickets {
    width: 95%;
    padding: 5px;
    box-shadow: 5px 5px 10px 10px #464646;
    background-color: #2e2e2e;
    margin: 2px;

}
</style>