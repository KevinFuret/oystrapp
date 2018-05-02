<template>
  <section style="width: 100%">
    <nuxt-link to="/"><h2>Liste</h2></nuxt-link>
    <hr>
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
      <!-- User Position -->
      <googlemaps-user-position
        :props="propsUserPosition"
        @update:position="setUserPosition"
      />

      <googlemaps-marker
        v-for="(marker, index) of markers"
        :key="index"
        :icon="icon"
        :position="marker.position"
        @click="updateMapState(marker)"
      />
    </googlemaps-map>
    <!-- </no-ssr> -->
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
    center: { lat: 47.218371, lng: -1.553621 },
    userPosition: { lat: 47.218371, lng: -1.553621 }, // by default you are in Nantes
    zoom: 12,
    mapOptions: {
      draggable: true,
      zoomControl: true,
      mapTypeId: 'roadmap',
      styles: mapStyle
    },
    icon: {
      url: markerIcon,
      // This marker is 20 pixels wide by 32 pixels high.
      // scaledSize: new google.maps.Size(20, 35)
    },
    propsUserPosition: {
      // accuracy: 0,
    }
   }
  },
  computed: {
    ...mapGetters({
      markers: 'geolocation/getLocations'
    }),
    // TODO : display distance between places and userPosition
    distance () {
      let earthRadius = 6378137 //Rayon de la terre en mètre
      let latPlace = ""
      let lngPlace = ""
      let latUser = Math.PI / 180 * this.userPosition.lat
      let lngUser = Math.PI / 180 *  this.userPosition.lng
      this.markers.forEach( function (location) {
        latPlace = Math.PI / 180 * location.position.lat
        lngPlace = Math.PI / 180 * location.position.lng
        // trouver la bonne formule mathématique
        // var angle = google.maps.geometry.spherical.computeHeading( depart, arrivee)
      })
    }
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
      this.$refs.mapRef.panTo(marker.position)

    }
  }
}
</script>
