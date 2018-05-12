<template>
  <section style="width: 100%">
    <nuxt-link to="/"><h2>Liste</h2></nuxt-link>
    <button type="button" :disabled="!userPosition"
      @click="centerOnUser">Find me !</button>
    <!-- <no-ssr> -->
      <googlemaps-map
        ref="mapRef"
        :center.sync="center"
        :zoom.sync="zoom"
        :options="mapOptions"
        @ready="ready"
        style="width: 100%; height: 80vh"
      >
        <googlemaps-marker
          v-if="mapLoaded"
          :icon="iconUser"
          :options="markerOptions"
          :position="userPosition"
        />

        <googlemaps-marker
          v-if="mapLoaded"
          class="markerClicked"
          v-for="(marker, index) of markers"
          :key="index"
          :icon="icon"
          :opacity="opacity"
          :options="markerOptions"
          :position="marker.position"
          @click="updateStateMarker(marker, index)"
        />
      </googlemaps-map>
    <!-- </no-ssr> -->
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import markerUser from '~/assets/img/marker-user.svg'
import markerIcon from '~/assets/img/location-pointer.svg'
import mapStyle from '~/assets/json/mapStyle.json'
import * as VueGoogleMaps from 'vue-googlemaps'
import { EventBus } from '~/plugins/event-bus.js';

export default {
  name: 'mapComponent',
  data () {
   return {
     mapLoaded: false,
     // center = userposition
     // default nantes coordinates
    center: { lat: 47.218371, lng: -1.553621 },
    zoom: 12,
    mapOptions: {
      draggable: true,
      zoomControl: true,
      mapTypeId: 'roadmap',
      styles: mapStyle
    },
    markerOptions: {
      optimized: false,
    },
    opacity: 0.8,
    icon: {
      url: markerIcon,
      scaledSize: new window.google.maps.Size(30, 42)
    },
    iconUser: {
      url: markerUser,
      scaledSize: new window.google.maps.Size(20, 32)
    }
   }
  },
  computed: {
    ...mapGetters({
      markers: 'geolocation/getLocations',
      userPosition: 'geolocation/getUserPosition'
    })
  },
  created () {
    EventBus.$on('i-got-swiped', index => {
      // console.log(`Oh, that's nice. I swiped on ${index} ! :)`)
      this.panToMarker(index)
    })
  },
  methods: {
    ready () {
      this.$refs.mapRef._watcher.user = true
      this.$refs.mapRef.resize()
      this.mapLoaded = true
      // console.log(this.$refs.mapRef.zoom);
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

</style>
