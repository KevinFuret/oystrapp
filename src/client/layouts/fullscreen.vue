<template>
    <v-app id="inspire">
        <v-toolbar app fixed>
            <v-btn icon @click.stop="goBack">
                <v-icon>arrow_back</v-icon>
            </v-btn>
            <span @click.stop="goBack">Retour</span>
            <v-toolbar-title> {{ name }} </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-content app clipped-left>
            <v-container fluid>
                <nuxt></nuxt>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
  // search icons: https://material.io/icons/ asd

  export default {
    props: {
      source: String
    },
    data () {
      return {
        drawer: null,
        name: 'OYSTR',
        right: null
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
</style>
