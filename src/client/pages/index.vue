<template>
    <v-layout>
        <section>
            <nuxt-link to="/mapPlaces"><h2>Map</h2></nuxt-link>
            <hr>
            <filters></filters>
            <!--<button type="button" name="button" v-on:click="getlocalStorage">Click</button>-->
            <ul class="placesList">
                <li class="place" v-for="place in selectedPlaces" :key="place.id" v-if="$store.state.places.selectedCategories.length !== 0">
                    <place-card v-bind:placeN1="place.fields"></place-card>
                </li>
                <li class="place" v-for="place in placesN1" :key="place.id" v-if="$store.state.places.selectedCategories.length === 0">
                    <place-card v-bind:placeN1="place.fields"></place-card>
                </li>
            </ul>
        </section>
    </v-layout>
</template>

<script>
import placeCard from '../components/placeCard.vue'
import filters from '../components/filters.vue'
import { mapGetters } from 'vuex'


export default {
  components: {
    'place-card': placeCard,
    filters
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
      console.log('saved token', savedToken)
      const data = await store.dispatch('places/updateContent', { savedToken })
    }
  },
  computed: {
    ...mapGetters({
      placesN1: 'places/getPlacesN1',
      selectedPlaces: 'places/getSelectedPlaces'
    })
  },
  mounted () {
    // ask user location
    // if he accepts, we populate the store
    // TODO : ask at the end of the onboarding
    this.$getLocation()
      .then(coordinates => {
        let userPosition = coordinates
        this.$store.dispatch('geolocation/setUserPosition', { userPosition })
      });
    // console.log('all space', this.$store.state.places['entries'])
  }
}
</script>
<style>
    .placesList{
        max-width: 100%;
        list-style-type: none;
    }
</style>
