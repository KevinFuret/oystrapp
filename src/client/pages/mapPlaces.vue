<template>
  <v-layout>
    <map-component v-bind:markers="markersPlaces"></map-component>

    <div class="places-map__slider">
      <div v-swiper:mySwiperMap="swiperOptionMap" class="swiper-box">
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
      swiperOptionMap: {
        // init: false,
        slidesPerView: 'auto',
        grabCursor: true,
        mousewheel: true,
        freeMode: false,
        spaceBetween: 10,
        slidesOffsetAfter: 3500, // empêche que le slider s'arrête au milieu de la dernière card
        on: {
          slideChange () {
            // console.log('translate', this.translate)
            console.log('active index', this.activeIndex)
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
      selectedPlaces: 'places/getSelectedPlaces',
      markersPlaces: 'geolocation/getLocations'
    })
  },
  created () {
    // listen on global event bus
    // event from map.vue
    EventBus.$on('i-got-clicked', index => {
      console.log(`Oh, that's nice. I clicked on ${index} marker! :)`)
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
      if(this.mySwiperMap !== undefined) {
        console.log(this.mySwiperMap);
        this.mySwiperMap.slideTo(index, 0)
      }
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
    bottom: 0;
  }

  .swiper-wrapper {
    /* transform: translate3d(185px, 0px, 0px)!important; */
    /* align-items: flex-end; */
    padding-left:0.7rem;
  }

  .swiper-slide {
      width: 25rem;
      box-sizing: border-box;
      /* transform: translateX(20%); */
  }

</style>
