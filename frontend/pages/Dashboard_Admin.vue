<template>
    <v-container>
      <v-layout>
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <span class="headline">Admin Home Page</span>
            </v-card-title>
            <v-card-subtitle>
              <p>NECESSARIO MEXER. AQUINO E MATEUS</p>
            </v-card-subtitle>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </template>
  
  <script>
  export default {
    middleware: ['auth', 'admin']
  }
  </script>
  