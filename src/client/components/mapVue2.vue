<template>
  <GmapMap
  :center="center"
  :zoom="zoom"
  map-type-id="terrain"
  style="width: 500px; height: 300px"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
    />
  </GmapMap>
</template>

<script>
export default {
  name: 'mapVue2',
  data () {
   return {
    center: { lat: 47.218371, lng: -1.553621 },
    markers: [{
      position: { lat: 47.218371, lng: -1.553621 }
    }],
    zoom: 12
   }
  }
}
</script>
