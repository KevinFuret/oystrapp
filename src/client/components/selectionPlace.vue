<template>
    <div class="selection-place" v-if="placeDetails">
        <div class="selection-place__image">
            <img :src="image[0].fields.file.fr.url">
        </div>
        <p class="selection-place__open open-dot" :class="isPlaceOpen"
           v-if="isPlaceOpen !== undefined">
            <span class="open-dot__text" v-if="isPlaceOpen === 'open-dot--open'">Ouvert</span>
            <span class="open-dot__text" v-if="isPlaceOpen === 'open-dot--closed'">Fermé</span>
        </p>
        <h3 class="selection-place__title">{{ place.fields.name.fr }}</h3>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      hello: 'coucou',
      placeDetails: ''
    }
  },
  props: [
    'place'
  ],
  computed: {
    ...mapGetters({
      placesN1: 'places/getPlacesN1',
      getPlaceBySlug: 'places/getPlaceN1BySlug'
    }),
    image () {
      let assets = this.$store.state.places['assets']
      const imageId = this.place.fields.images.fr[0].sys.id
      return assets.filter(function (image) {
        // on récupère l'asset qui correspond à l'id
        return image['sys']['id'] === imageId
      })
    },
    isPlaceOpen () {
      console.log('isopennow?', this.placeDetails.isOpenNow)
      if (this.placeDetails.isOpenNow === undefined) console.log('google infos', this.placeDetails.googleInfos)
      else if (this.placeDetails.isOpenNow === null) return 'its null'
      else if (this.placeDetails.isOpenNow) return 'open-dot--open'
      else return 'open-dot--closed'
    }
  },
  mounted () {
    this.placeDetails = this.getPlaceBySlug(this.place.fields.slug.fr)[0].fields
    if (this.placeDetails.googleInfos === undefined) {
      this.getGoogleInfos()
    }
    if (this.placeDetails.slug !== undefined) {
      this.recalculateIsOpenNow()
      console.log('place', this.place.fields)
    }
  },
  methods: {
    getPlaceDetails () {

    },
    getGoogleInfos () {
      let payload = {placeId: this.place.fields.googlePlaceId.fr}
      this.$store.dispatch('places/getGoogleInfos', payload)
    },
    recalculateIsOpenNow () {
      this.$store.dispatch('places/recalculateIsOpenNow', this.place.fields.slug.fr)
    }
  }
}
</script>
<style>
    .selection-place{
        width: 150px;
        box-sizing: border-box;
        margin-right:0.5rem;
    }
    .selection-place__image img{
        width:100%;
        height: 6.5rem;
        object-fit: cover;
    }
    .selection-place__title{
        font-weight:bold;
        font-size:1rem;
    }
    .selection-place__open{
        display: flex;
        align-items: center;
        margin-bottom:0;
    }
    .open-dot:before{
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        align-self: center;
        margin-right:0.5rem;
        margin-bottom:0.2rem;
        background:lightgrey;

    }
    .open-dot--open:before{
        background:#76bb71;
    }
    .open-dot--closed:before{
        background:red;
    }
    .open-dot .open-dot__text{
        font-size:0.8rem;
        text-transform: uppercase;
    }
    .open-dot--open .open-dot__text{
        color: #76bb71;
    }
    .open-dot--closed .open-dot__text{
        color: red;
    }
</style>