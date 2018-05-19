<template>
    <div v-if="placeDetails">
        <header class="header header--place">
            <img class="header__image" :src="image" alt="Image du lieu">
            <div class="header__categories">
                <span class="card__category category-tag">
                    {{ placeDetails.category.fr.fields.name.fr }}
                </span>
            </div>
        </header>
        <div class="details">
            <h1 class="details__title">{{ placeDetails.name.fr }}</h1>
            <a href="" alt="share" class="details__share share-button">
                <img :src="share" class="share-button__image" alt="Partager ce lieu avec vos amis">
            </a>
            <div class="details__description">
                {{ placeDetails.description.fr }}
            </div>
        </div>
        <div class="infos-blocks">
            <info-block v-for="placeInfo in placeInfos" :key="placeInfo.type"
                        :type="placeInfo.type" :content="placeInfo.content" :canBeOpened="placeInfo.canBeOpened"
                        v-if="placeInfo.type !== 'hours' || (placeInfo.type === 'hours' && placeDetails.googleInfos.opening_hours && placeDetails.isOpenNow !== null)">
            </info-block>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import share from '~/assets/img/share.svg'
import button from '~/components/button.vue'
import placeInfo from '~/components/placeInfo.vue'
import placeN2Card from '~/components/placeN2Card.vue'
import { EventBus } from '~/plugins/event-bus.js';

export default {
  layout: 'fullscreen',
  components: {
    'custom-button': button,
    'info-block': placeInfo,
    'small-card': placeN2Card
  },
  data () {
    return {
      slug: this.$route.params.placeN2Slug,
      placeDetails: '',
      share,
      isPlaceOpen: null,
      placeOpeningHoursText: null
    }
  },
  computed: {
    ...mapGetters({
      placesN1: 'places/getPlacesN1',
      getPlaceN2BySlug: 'places/getPlaceN2BySlug'
    }),
    image () {
      return this.placeDetails.image.fr[0].fields.file.fr.url
    },
    placeInfos () {
      if (this.placeDetails) {
        return [{
          type: 'address',
          canBeOpened: false,
          content: {
            'contentOpen': this.placeDetails.googleInfos.adr_address,
            'urlMap': 'https://www.google.com/maps/dir/?api=1&destination=' + this.placeDetails.location.fr.lat + ',' + this.placeDetails.location.fr.lon + '&destination_place_id=' + this.placeDetails.googlePlaceId.fr
          }
        }, {
          type: 'hours',
          canBeOpened: true,
          content: {
            'contentOpen': this.placeDetails.isOpenNow,
            'contentClosed': this.placeOpeningHoursText
          }
        }]
      }
    }
  },
  methods: {
    getPlaceDetails () {
      let place = this.getPlaceN2BySlug(this.slug)
      place = place[0].fields
      this.placeDetails = place
      console.log('place', place)
    },
    recalculateIsOpenNow () {
      this.$store.dispatch('places/recalculateIsOpenNow', this.slug)
    },
    getGoogleInfos () {
      let payload = {placeId: this.placeDetails.googlePlaceId.fr}
      this.$store.dispatch('places/getGoogleInfos', payload)
    }
  },
  mounted () {
    EventBus.$off('i-got-clicked')
    EventBus.$off('i-got-swiped')

    this.getPlaceDetails()
    if (this.placeDetails.googleInfos === undefined) {
      this.getGoogleInfos()
    } else {
      console.log('google infos already set : ', this.placeDetails.googleInfos)
    }
    this.recalculateIsOpenNow()
    if (this.placeDetails.googleInfos === undefined) console.log('google infos undefined', this.googleInfos)
    else if (this.placeDetails.googleInfos.opening_hours === undefined) this.isPlaceOpen = null
    else {
      this.placeOpeningHoursText = this.placeDetails.googleInfos.opening_hours.weekday_text
    }
  }
}
</script>
<style>
    .header{
        width:100vw;
        height:auto;
        position: relative;
        top: -0.5rem;
        left: -0.5rem;
    }
    .header__image{
        width:100%;
        max-height:15.4rem;
    }
    .header__categories{
        position: absolute;
        bottom: 1.25rem;
        left: .5rem;
    }
    .category-tag{
        background: white;
        margin:0 0.75rem;
        padding:.35rem .75rem .25rem;
        font-size:0.8rem;
        display: inline-block;
        vertical-align: middle;
        color: black;
    }
    .details{
        display: grid;
        grid-template-columns: auto 30px;
        grid-template-rows: auto auto;
        padding: 0.5rem;
    }
    .details__share{
        align-self: center;
        justify-self:center;
        height:20px;
    }
    .details__title{
        font-size: 1.72rem;
        line-height:normal;
    }
    .details__description{
        margin:1rem 0;
        font-size:16px;
        /*grid-column: 1 / -1;*/
    }
    .tickets{
        margin:2rem 0;
    }
    .related-places{
        padding: .5rem;
    }
    .related-places__title{
        font-size:16px;
        margin-bottom:1rem;
    }
    .my-swiperN2.swiper-container {
        height: auto;
        width: 100%;
        position: relative;
    }
    .my-swiperN2--notswiper{
        position: relative;
    }
    .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        width:auto;
    }
    .slider__container{
        position: relative;
        display: flex;
        align-items:center;
    }
    .slider__element{
        margin-right:0.5rem;
    }
</style>
