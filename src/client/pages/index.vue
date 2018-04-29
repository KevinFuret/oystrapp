<template>
    <v-layout>
      <ul class="placesList">
        <li class="place" v-for="placeN1 in placesN1" :key="placeN1.id">
          <place-card v-bind:placeN1="placeN1.fields"></place-card>
        </li>
      </ul>
    </v-layout>
</template>

<script>
import placeCard from '../components/placeCard.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    'place-card': placeCard
  },
  // populate store before page rendering
  async fetch ({ store }) {
    // if the store is empty
    // console.log(store.getters.entries);
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
    ...mapGetters({
      lieuxN1: 'places/getPlacesN1'
    })
  },
  mounted () {
    console.log('all space', this.$store.state.places['entries'])
  }
  // methods: {
  //   readLocalStorage () {
  //     if (process.client) {
  //       console.log(localStorage.getItem('oystrPlaces'));
  //     }
  //   }
  // },
  // beforeMount () {
  //   this.readLocalStorage()
  // }
}
</script>
<style>
    .placesList{
        max-width: 100%;
        list-style-type: none;
    }
</style>
