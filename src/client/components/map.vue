<template>
  <v-layout>
    Les lieux N1 : {{ lieuxN1 }}
    <no-ssr>
      <googlemaps-map
        ref="map"
        :center.sync="center"
        :zoom="zoom"
        @ready="ready"
        style="width: 100%; height: 85vh"
      >

        <!-- User Position -->
        <googlemaps-user-position
          @update:position="setUserPosition"
        />

        <googlemaps-marker
          v-for="(marker, index) of markers"
          :key="index"
          :position="marker.position"
          @click="center=marker.position"
        />
      </googlemaps-map>
    </no-ssr>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'mapComponent',
  data () {
   return {
    center: { lat: 47.218371, lng: -1.553621 },
    markers: [{
      position: { lat: 47.218371, lng: -1.553621 }
    }],
    userPosition: null,
    zoom: 12
   }
  },
  computed: {
    ...mapGetters({
      lieuxN1: 'places/getPlacesN1'
    })
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
