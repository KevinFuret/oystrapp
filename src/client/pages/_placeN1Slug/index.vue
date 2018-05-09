<template>
    <div v-if="placeDetails">
        <nuxt-link to="/">home</nuxt-link>
        <h1>{{ placeDetails.name.fr }}</h1>
        <p>slug: {{slug}}</p>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      title: 'a place detail page',
      slug: this.$route.params.placeN1Slug,
      placeDetails: ''
    }
  },
  computed: {
    ...mapGetters({
      placesN1: 'places/getPlacesN1',
      getPlaceBySlug: 'places/getPlaceBySlug'
    })
  },
  methods: {
    getPlaceDetails () {
      let place = this.getPlaceBySlug(this.slug)
      place = place[0].fields
      this.placeDetails = place
    }
  },
  mounted () {
    this.getPlaceDetails()
  }
}
</script>