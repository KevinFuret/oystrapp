<template>
    <v-layout>
        <section>
            <nuxt-link to="/mapPlaces"><h2>Map</h2></nuxt-link>
            <!--<button type="button" name="button" v-on:click="getlocalStorage">Click</button>-->
            <ul class="placesList">
                <li class="place" v-for="place in selectedPlaces" :key="place.id"
                    v-if="$store.state.places.selectedCategories.length !== 0 || $store.state.places.selectedFilters.length !== 0">
                    <place-card v-bind:placeN1="place.fields"></place-card>
                </li>
                <li class="place" v-for="place in placesN1" :key="place.id"
                    v-if="$store.state.places.selectedCategories.length === 0 && $store.state.places.selectedFilters.length === 0">
                    <place-card v-bind:placeN1="place.fields"></place-card>
                </li>
            </ul>
        </section>
    </v-layout>
</template>

<script>
import placeCard from '../components/placeCard.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    'place-card': placeCard
  },
  computed: {
    ...mapGetters({
      placesN1: 'places/getPlacesN1',
      selectedPlaces: 'places/getSelectedPlaces'
    })
  },
  methods: {
    setUserPosition () {
      // ask user location
      // if he accepts, we populate the store
      // TODO : ask at the end of the onboarding
      this.$getLocation()
        .then(coordinates => {
          let userPosition = coordinates
          this.$store.dispatch('geolocation/setUserPosition', { userPosition })
        })
        .catch(error => {
          // console.log(error);
          // if user doesn't accept, so we locate him in Nantes
          let userPosition = {lat: 47.218371, lng: -1.553621}
          this.$store.dispatch('geolocation/setUserPosition', { userPosition } )
        })
    },
    async manageStoreContentful () {
      if (this.$store.state.places['entries'].length === 0) {
        // call the Contentful API to get entries and use store management
        const data = await this.$store.dispatch('places/fetchAllPlaces')
      } else {
        // sync modifications
        let savedToken = this.$store.state.places['token']
        const data = await this.$store.dispatch('places/updateContent', { savedToken })
      }
    }
  },
  mounted: async function () {
    this.setUserPosition()
    this.manageStoreContentful()
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
