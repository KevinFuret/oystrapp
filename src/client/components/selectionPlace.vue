<template>
    <div class="selection-place">
        <div class="selection-place__image">
            <img :src="image[0].fields.file.fr.url">
        </div>
        <span class="selection-place__open open-dot" :class="isPlaceOpen"> open?</span>
        <h3 class="selection-place__title">{{ place.fields.name.fr }}</h3>

    </div>
</template>
<script>
export default {
  data () {
    return {
      hello: 'coucou'
    }
  },
  props: [
    'place'
  ],
  computed: {
    image () {
      let assets = this.$store.state.places['assets']
      const imageId = this.place.fields.images.fr[0].sys.id
      return assets.filter(function (image) {
        // on récupère l'asset qui correspond à l'id
        return image['sys']['id'] === imageId
      })
    },
    isPlaceOpen () {
      console.log('isopennow?', this.place.fields.isOpenNow)
      if (this.place.fields.isOpenNow === undefined) console.log('google infos', this.place.googleInfos)
      else if (this.place.fields.isOpenNow === null) return 'its null'
      else if (this.place.fields.isOpenNow) return 'open-dot--open'
      else return 'open-dot--closed'
    }
  },
  mounted () {
    if (this.place.fields.googleInfos === undefined) {
      this.getGoogleInfos()
    }
    if (this.place.fields.slug !== undefined) {
      this.recalculateIsOpenNow()
      console.log('place', this.place.fields)
    }
  },
  methods: {
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
        font-size:0.8rem;
        text-transform: uppercase;
        color: #76bb71;
    }
</style>