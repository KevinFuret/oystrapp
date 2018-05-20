<template>
    <div class="selection__place">
        <p>ouvert ?
            <span class="open-dot" :class="isPlaceOpen"></span>
            {{isPlaceOpen}}
        </p>
        <p>nom : {{ place.fields.name.fr }}</p>
        <p>image :

        </p>
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