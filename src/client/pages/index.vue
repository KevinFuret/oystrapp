<template>
    <v-layout>
      <button type="button" name="button" v-on:click="getlocalStorage">Click</button>
      <ul class="placesList">
        <li class="place" v-for="placeN1 in placesN1" :key="placeN1.id">
          <place-card v-bind:placeN1="placeN1.fields"></place-card>
        </li>
      </ul>
    </v-layout>
</template>

<script>
import placeCard from '../components/placeCard.vue'

export default {
  components: {
    'place-card': placeCard
  },
  // populate store before page rendering
  async fetch ({ store }) {
    // if the store is empty
    if (store.state.places['entries'].length === 0) {
      // call the Contentful API to get entries and use store management
      const data = await store.dispatch('places/fetchAllPlaces')
    } else {
      // sync modifications
      let savedToken = store.state.places['token']
      console.log(savedToken)
      const data = await store.dispatch('places/updateContent', { savedToken })
    }
  },
  computed: {
    entries () {
      return this.$store.state.places['entries']
    },
    // return array of all entries with id = lieuN1
    placesN1 () {
      let entries = this.$store.state.places['entries']
      return entries.filter( function (placeN1) {
        return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
      })
    }
  },
  mounted () {
    console.log('all space', this.$store.state.places['entries'])
  }
}
</script>
<style>
    .placesList{
        max-width: 100%;
        list-style-type: none;
    }
</style>
