<template>
    <v-app id="inspire">
        <v-toolbar app fixed>
            <v-btn icon @click.stop="goBack">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <span @click.stop="goBack">Retour</span>
            <v-toolbar-title> <img :src="logo" alt="OYSTR" class="toolbar__logo"> </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-content app clipped-left @click.stop="drawer = !drawer">
            <v-container fluid>
                <nuxt></nuxt>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
  // search icons: https://material.io/icons/ asd
  import logo from '~/assets/img/logo.png'
  export default {
    props: {
      source: String
    },
    data () {
      return {
        drawer: null,
        name: 'OYSTR',
        right: null,
        logo
      }
    },
    methods: {
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style>
    .container{
        position: relative;
    }
    .toolbar__title{
        width: 100%;
        text-align: center;
        margin-left: 0;
    }
    .toolbar__logo{
        width:90px;
    }
    .application .theme--light.toolbar,
    .theme--light .toolbar{
        background: white;
        box-shadow: none;
    }

    .application.theme--light,
    body .application--wrap{
        background: white;
    }
</style>
