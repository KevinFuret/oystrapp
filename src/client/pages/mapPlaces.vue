<template>
  <v-layout>
    <map-component></map-component>
  </v-layout>
</template>

<script>
import mapComponent from '../components/map.vue'

export default {
  components: {
    'map-component': mapComponent
  }
}
</script>
