<template>
  <section style="width: 100%">
    <nuxt-link to="/"><h2>Liste</h2></nuxt-link>
    <hr>
    <button type="button" :disabled="!userPosition"
      @click="centerOnUser">Find me !</button>
    <no-ssr>
      <googlemaps-map
        ref="mapRef"
        :center.sync="center"
        :zoom.sync="zoom"
        :options="mapOptions"
        @ready="ready"
        style="width: 100%; height: 80vh"
      >
        <!-- User Position -->
        <!-- <googlemaps-user-position
          @update:position="setUserPosition"
        /> -->

        <googlemaps-marker
          v-for="(marker, index) of markers"
          :key="index"
          :icon="icon"
          :options="markerOptions"
          :position="marker.position"
          @click="updateMapState(marker)"
        />
      </googlemaps-map>
    </no-ssr>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import markerIcon from '~/assets/img/marker.svg'
import mapStyle from '~/assets/json/mapStyle.json'
import * as VueGoogleMaps from 'vue-googlemaps'

export default {
  name: 'mapComponent',
  data () {
   return {
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
      optimized: false
    },
    icon: {
      url: markerIcon,
      // This marker is 20 pixels wide by 32 pixels high.
      scaledSize: new google.maps.Size(20, 35)
    }
   }
  },
  computed: {
    ...mapGetters({
      markers: 'geolocation/getLocations',
      userPosition: 'geolocation/getUserPosition'
    })
  },
  mounted () {
    // console.log(new google.maps.geometry.spherical);
    // console.log("Vue google maps " + JSON.stringify(VueGoogleMaps));
  },
  methods: {
    ready () {
      this.$refs.mapRef._watcher.user = true
      this.$refs.mapRef.resize()
      console.log(this.$refs.mapRef);
    },
    centerOnUser () {
      if (this.userPosition) {
        this.zoom = 12 // back to zoom default
        this.$refs.mapRef.panTo(this.userPosition)
      }
    },
    setUserPosition (position) {
      this.userPosition = position
      // console.log("user position: " , this.userPosition)
    },
    updateMapState (marker) {
      this.zoom = Math.max(15, 12)
      this.$refs.mapRef.panTo(marker.position)

    }
  }
}
</script>
