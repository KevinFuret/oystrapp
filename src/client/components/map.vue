<template>
  <no-ssr>
    <section style="width: 100%" class="map">
      <!-- <button v-if="isLocated" :disabled="!userPosition"
        @click="centerOnUser">Find me !</button> -->
        <googlemaps-map
          ref="mapRef"
          :center.sync="center"
          :zoom.sync="zoom"
          :options="mapOptions"
          @ready="ready"
          style="width: 100%; height: 80vh"
        >
          <marker-user
            v-if="isLocated"
            v-bind:userPosition="userPosition"
          >
          </marker-user>

          <markers-places
            v-for="(marker, index) of markers"
            :key="index"
            v-bind:marker="marker"
            @click="updateStateMarker(marker, index)"
          >
          </markers-places>
        </googlemaps-map>
    </section>
  </no-ssr>
</template>

<script>
import mapStyle from '~/assets/json/mapStyle.json'
import * as VueGoogleMaps from 'vue-googlemaps'
import { EventBus } from '~/plugins/event-bus.js'
import markersPlaces from './markersPlaces.vue'
import markerUser from './markerUser.vue'

export default {
  name: 'mapComponent',
  data () {
   return {
    center: { lat: 47.218371, lng: -1.553621 },
    zoom: 12,
    mapOptions: {
      draggable: true,
      zoomControl: true,
      mapTypeId: 'roadmap',
      styles: mapStyle
    }
   }
  },
  props: ['markers'],
  components: {
    'markers-places': markersPlaces,
    'marker-user': markerUser
  },
  computed: {
    userPosition() {
      return this.$store.getters['geolocation/getUserPosition']
    },
    isLocated() {
      return this.$store.getters['geolocation/getIsLocated']
    }
  },
  created () {
    EventBus.$on('i-got-swiped', index => {
      this.panToMarker(index)
    })
  },
  methods: {
    ready () {
      this.$refs.mapRef.resize()
    },
    centerOnUser () {
      if (this.userPosition) {
        this.zoom = 12 // back to zoom default
        this.center = this.userPosition
        // this.$refs.mapRef.panTo(this.userPosition)
      }
    },
    updateStateMarker (marker, index) {
      // console.log(this.zoom);
      if (this.zoom <= 12) {
        this.zoom = Math.max(15, 12)
      }
      this.$refs.mapRef.panTo(marker.position)
      // Send the event on a channel (i-got-clicked) with a payload (index of the clicked marker.)
      EventBus.$emit('i-got-clicked', index);
    },
    panToMarker (index) {
      if (this.zoom <= 12) {
        this.zoom = Math.max(15, 12)
      }
      this.center = this.markers[index].position
      // this.$refs.mapRef.panTo(this.markers[index].position)
    }
  }
}
</script>

<style>
.map {
  position: relative;
}
</style>
