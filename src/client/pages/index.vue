<template>
    <v-layout>
      <!-- display 'lieuN1' -->
        <ul>
          <li v-for="placeN1 in placesN1">
            {{ placeN1.fields.name.fr }}
          </li>
          <!-- TODO : display informations for each places -->
          <place-card v-for="placeN1 in placesN1" :key="placeN1.id"></place-card>
        </ul>

    </v-layout>
</template>

<script>
import placeCard from '../components/placeCard.vue'

export default {
  components: {
    'place-card': placeCard
  },
  async fetch ({ store }) {
    // if the store is empty
    if (store.state.places['entries'].length === 0) {
      // call the Contentful API to get entries and use store management
      const data = await store.dispatch('places/fetchAllPlaces')
    } else {
      // sync modifications
      const savedToken = store.state.places['token']
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
        return placeN1['sys']['contentType']['sys']['id'] === "lieuN1"
      })
    }
  }
}
</script>
