<template>
    <v-layout index>
        <section>
            <ul class="placesList">
                <li class="place" v-for="place in selectedPlaces" :key="place.sys.id"
                    v-if="$store.state.places.selectedCategories.length !== 0 || $store.state.places.selectedFilters.length !== 0">
                    <place-card v-bind:placeN1="place.fields"></place-card>
                </li>
                <li class="place" v-for="place in placesN1" :key="place.sys.id"
                    v-if="$store.state.places.selectedCategories.length === 0 && $store.state.places.selectedFilters.length === 0">
                    <place-card v-bind:placeN1="place.fields"></place-card>
                </li>
            </ul>
            <div v-if="($store.state.places.selectedCategories.length !== 0 || $store.state.places.selectedFilters.length !== 0) && selectedPlaces.length < 1">
                <h3>Aucun résultat pour cette recherche</h3>
                <p>Essayez de sélectionner d'autres catégories !</p>
            </div>
        </section>
    </v-layout>
</template>

<script>
import placeCard from '../components/placeCard.vue'
import { mapGetters } from 'vuex'
import * as VueGeolocation from 'vue-browser-geolocation'
import { EventBus } from '~/plugins/event-bus.js';

export default {
  components: {
    'place-card': placeCard
  },
  computed: {
    ...mapGetters({
      placesN1: 'places/getPlacesN1',
      selectedPlaces: 'places/getSelectedPlaces',
      userPosition: 'geolocation/getUserPosition'
    })
  },
  methods: {
    setUserPosition () {
      // ask user location
      // if he accepts, we populate the store
      // TODO : ask at the end of the onboarding

      // navigator.geolocation.getCurrentPosition(e => {
      //   console.log(e)
      //   let userPosition = e
      //   this.$store.dispatch('geolocation/setUserPosition', { userPosition })
      //
      // })

      this.$getLocation()
        .then(coordinates => {
          let userPosition = coordinates
          this.$store.dispatch('geolocation/setUserPosition', { userPosition })
        })
        .catch(error => {
          // console.log(error)
          this.$store.dispatch('geolocation/displayDistance', false )
        })
    },

    async manageStoreContentful () {
      if (this.$store.state.places['entries'].length === 0) {
        // call the Contentful API to get entries and use store management
        const data = await this.$store.dispatch('places/fetchAllPlaces')
      } else {
        // sync modifications
        console.log('syncing ?')
        let savedToken = this.$store.state.places['token']
        const data = await this.$store.dispatch('places/updateContent', { savedToken })
      }
    }
  },
  mounted () {
    this.setUserPosition()
    this.manageStoreContentful() // put in beforeMount ?

    // stop listening global events for map
    EventBus.$off('i-got-clicked')
    EventBus.$off('i-got-swiped')
  },
  watch: {
    userPosition(newPosition, oldPosition) {
      console.log('newPosition', newPosition)
      // this.$store.dispatch('geolocation/watchUserPosition', { newPosition } )
    }
  }
}
</script>
<style>
    .placesList{
        max-width: 100%;
        list-style-type: none;
    }

    .application a{
        text-decoration: none;
    }

    .index {
      padding: 0.5rem;
    }
</style>
