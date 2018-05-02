<template>
  <v-layout>
    
    <map-component></map-component>

    <div class="places-map__slider">
      <div v-swiper:mySwiper="swiperOption" class="swiper-box" ref="mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="place in placesN1" :key="place.id"
                v-if="$store.state.places.selectedCategories.length === 0">
            <place-card-map v-bind:placeN1="place.fields"></place-card-map>
          </div>
          <div class="swiper-slide" v-for="place in selectedPlaces" :key="place.id"
                v-if="$store.state.places.selectedCategories.length !== 0">
            <place-card-map v-bind:placeN1="place.fields"></place-card-map>
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
        spaceBetween: 10,
        slidesOffsetAfter: 80, // empêche que le slider s'arrête au milieu de la dernière card (mobile version)
        on: {
          slideChange () {
            console.log('translate', this.translate)
            console.log('active index', this.activeIndex
            )
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
  }
}
</script>

<style>
  .places-map__slider {
    display: flex;
    align-self: flex-end;
    padding-bottom: 18rem;
  }
  .swiper-box {
    transform: translateX(-85%);
    width: 100%;
    margin: 0 auto;
  }
  .swiper-slide {
    width: 80%;
    align-items: flex-end;
  }
</style>
