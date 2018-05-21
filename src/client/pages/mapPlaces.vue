<template>
  <v-layout>
    <map-component></map-component>

    <div class="places-map__slider">
      <div v-swiper:mySwiperMap="swiperOption" class="swiper-box">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(place, index) in placesN1" :key="place.id" v-bind:data-id="index"
               v-if="$store.state.places.selectedCategories.length === 0 && $store.state.places.selectedFilters.length === 0">
            <place-card-map v-bind:placeN1="place"></place-card-map>
          </div>
          <div class="swiper-slide" v-for="(place, index) in selectedPlaces" :key="place.id" v-bind:data-id="index"
               v-if="$store.state.places.selectedCategories.length !== 0 || $store.state.places.selectedFilters.length !== 0">
            <place-card-map v-bind:placeN1="place"></place-card-map>
          </div>
        </div>
      </div>
    </div>
  </v-layout>
</template>

<script>
import mapComponent from '../components/map.vue'
import placeCardMap from '../components/placeCardMap.vue'
import { mapGetters } from 'vuex'
import { EventBus } from '~/plugins/event-bus.js';

export default {
  components: {
    'map-component': mapComponent,
    'place-card-map': placeCardMap
  },
  data () {
    return {
      swiperOption: {
        // init: false,
        slidesPerView: 'auto',
        grabCursor: true,
        mousewheel: true,
        spaceBetween: 20,
        slidesOffsetAfter: 1200, // empêche que le slider s'arrête au milieu de la dernière card (mobile version)
        on: {
          slideChange () {
            // console.log('translate', this.translate)
            // console.log('active index', this.activeIndex)
            EventBus.$emit('i-got-swiped', this.activeIndex)
          },
          tap () {
            console.log('onTap', this)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      placesN1: 'places/getPlacesN1',
      selectedPlaces: 'places/getSelectedPlaces'
    })
  },
  created () {
    // listen on global event bus
    // event from map.vue
    EventBus.$on('i-got-clicked', index => {
      // console.log(`Oh, that's nice. I clicked on ${index} marker! :)`)
      this.swipeTo(index)
    })
  },
  mounted () {
    this.$getLocation()
      .then(coordinates => {
        let userPosition = coordinates
        this.$store.dispatch('geolocation/setUserPosition', { userPosition })
      })
      .catch(error => {
        console.log(error);
      })
  },
  methods: {
    swipeTo (index) {
      this.mySwiperMap.slideTo(index, 0)
    }
  },
  watch: {
    userPosition(newPosition, oldPosition) {
      console.log('newPosition', newPosition)
    }
  }
}
</script>

<style scoped>
  .places-map__slider {
    position: absolute;
    bottom: 3rem;
  }
  .swiper-wrapper {
    width: 25%;
}
  .swiper-box {
    width: 100%;
    margin: 0 auto;
  }

</style>
