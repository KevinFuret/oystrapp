<template>
  <no-ssr>
    <googlemaps-map
      ref="map"
      :center.sync="center"
      :zoom="zoom"
      :options="options"
      @ready="ready"
      style="width: 100%; height: 90vh"
    >
      <!-- User Position -->
      <googlemaps-user-position
        @update:position="setUserPosition"
      />

      <googlemaps-marker
        v-for="(marker, index) of markers"
        :key="index"
        :icon="icon"
        :position="marker.position"
        @click="center=marker.position"
      />
    </googlemaps-map>
  </no-ssr>
</template>

<script>
import { mapGetters } from 'vuex'
import markerIcon from '~/assets/img/marker.svg'
import mapStyle from '~/assets/json/mapStyle.json'

export default {
  name: 'mapComponent',
  data () {
   return {
    center: { lat: 47.218371, lng: -1.553621 },
    userPosition: null,
    zoom: 12,
    icon: {
      url: markerIcon,
      // This marker is 20 pixels wide by 32 pixels high.
      scaledSize: new google.maps.Size(20, 35)
    },
    options: {
      draggable: true,
      mapTypeId: 'roadmap',
      styles: mapStyle
    }
   }
  },
  computed: {
    ...mapGetters({
      markers: 'places/getLocations'
    })
  },
  mounted () {
    console.log("selectedPlaces " + this.$store.state.places['selectedPlaces']);
  },
  methods: {
   ready () {
     this.$refs.map.resize()
   },
   setUserPosition (position) {
     this.userPosition = position
   }
  }
}
</script>
