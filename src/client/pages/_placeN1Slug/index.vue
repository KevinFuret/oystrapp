<template>
    <div v-if="placeDetails">
        <header class="header header--place">
            <img class="header__image" :src="image[0].fields.file.fr.url" alt="Image du lieu">
            <div class="header__categories">
                <span class="card__category category-tag" v-for="category in placeDetails.placeCategory.fr">
                    {{ category.fields.nom.fr }}
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
                        v-if="placeInfo.type !== 'hours' || (placeInfo.type === 'hours' && placeDetails.googleInfos.opening_hours)">
            </info-block>
        </div>
        <div class="tickets">
            <custom-button link="#" large="true">Acheter un billet</custom-button>
        </div>
        <footer class="related-places" v-if="placeDetails.lieuxN2">
            <h3 class="related-places__title">D'autres perles aux alentours</h3>
            <div class="related-places__slider">
                <div v-swiper:mySwiper="swiperOption" class="my-swiperN2" v-if="placeDetails.lieuxN2.fr.length > 1">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="place in placeDetails.lieuxN2.fr">
                            <small-card :placeDetails="place"></small-card>
                        </div>
                    </div>
                </div>
                <div class="my-swiperN2--notswiper" v-else>
                    <div class="swiperN2-wrapper">
                        <div class="swiperN2-slide" v-for="place in placeDetails.lieuxN2.fr">
                            <small-card :placeDetails="place"></small-card>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import share from '~/assets/img/share.svg'
import button from '~/components/button.vue'
import placeInfo from '~/components/placeInfo.vue'
import placeN2Card from '~/components/placeN2Card.vue'

export default {
  layout: 'fullscreen',
  components: {
    'custom-button': button,
    'info-block': placeInfo,
    'small-card': placeN2Card
  },
  data () {
    return {
      slug: this.$route.params.placeN1Slug,
      placeDetails: '',
      share,
      isPlaceOpen: null,
      placeOpeningHoursText: null,
      swiperOption: {
        // init:false,
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true,
        slidesOffsetAfter: 85, // empêche que le slider s'arrête au milieu de la dernière card
        on: {
          slideChange () {
            console.log('translate', this.translate)
            console.log('active index', this.activeIndex
            )
          },
          tap () {
            console.log('onTap', this)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      placesN1: 'places/getPlacesN1',
      getPlaceBySlug: 'places/getPlaceBySlug'
    }),
    image () {
      let assets = this.$store.state.places['assets']
      const imageId = this.placeDetails.images.fr[0].sys.id
      return assets.filter(function (image) {
        // this.placeN1.image.name.fr
        return image['sys']['id'] === imageId // mettre l'id de la placecard
      })
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
          type: 'price',
          canBeOpened: false,
          content: {
            'contentOpen': this.placeDetails.prices.fr
          }
        }, {
          type: 'hours',
          canBeOpened: true,
          content: {
            'contentOpen': this.isPlaceOpen,
            'contentClosed': this.placeOpeningHoursText
          }
        }]
      }
    }
  },
  methods: {
    getPlaceDetails () {
      let place = this.getPlaceBySlug(this.slug)
      place = place[0].fields
      this.placeDetails = place
      console.log(place)
    }
  },
  mounted () {
    this.getPlaceDetails()
    if (this.placeDetails.googleInfos === undefined) {
      this.getGoogleInfos()
    } else {
      // console.log('google infos already set : ', this.placeN1.googleInfos)
    }
    // set isPlaceOpen
    if (this.placeDetails.googleInfos === undefined) console.log(this.googleInfos)
    else if (this.placeDetails.googleInfos.opening_hours === undefined) this.isPlaceOpen = null
    else if (this.placeDetails.googleInfos.opening_hours.open_now === true) {
      this.isPlaceOpen = true
      this.placeOpeningHoursText = this.placeDetails.googleInfos.opening_hours.weekday_text
    } else {
      this.placeOpeningHoursText = this.placeDetails.googleInfos.opening_hours.weekday_text
    } this.isPlaceOpen = false
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