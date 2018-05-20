<template>
    <transition name="fade" mode="in-out">
    <section class="placeCard">
        <nuxt-link :to="link">
            <header class="card__header">
                <img class="card__image card__image--big" :src="image[0].fields.file.fr.url" alt="Image du lieu">
                <div class="card__categories">
                    <span class="card__category category-tag" v-for="category in placeN1.placeCategory.fr">
                        {{ category.fields.nom.fr }}
                    </span>
                </div>
            </header>
        </nuxt-link>
        <nuxt-link :to="link">
            <div class="placeCard__content placeCard__content--preview">
                <span class="open-dot" :class="isPlaceOpen"></span>
                <h2 class="placeCard__title">{{ placeN1.name.fr }}</h2>
                <span class="share-button"><img :src="share" alt="Partager"></span>
                <p class="placeCard__details" v-if="isLocated === true">
                    <span class="placeCard__detail" v-if="distance !== null"><img :src="location" alt="Distance" > {{ distance }}</span>
                    <span class="placeCard__detail" v-if="duration !== null"><img :src="pedestrian" alt="Temps"> {{ duration }}</span>
                </p>
            </div>
        </nuxt-link>
        <transition name="slide-down" mode="in-out">
            <div class="placeCard__content placeCard__content--more" v-show="isOpen">
            <p class="placeCard__description">{{ placeN1.description.fr }}</p>
            <hr class="placeCard__separator" v-if="placeN1.lieuxN2">
            <div class="placeCard__suggestions" v-if="placeN1.lieuxN2">
                <h3 class="subsection__title">Et pour la suite ?</h3>
                <div class="suggestions__slider">
                    <div v-swiper:mySwiper="swiperOption" class="my-swiper" v-if="placeN1.lieuxN2.fr.length > 1">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="place in placeN1.lieuxN2.fr">
                                <small-card :placeDetails="place"></small-card>
                            </div>
                        </div>
                    </div>
                    <div class="my-swiper--notswiper" v-else>
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="place in placeN1.lieuxN2.fr">
                                <small-card :placeDetails="place"></small-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        <div class="placeCard__toggle" @click="toggleCardOpen">
            <img class="toggle__arrow" :src="isOpen ? upArrow : downArrow" :alt="isOpen ? 'plus d\'infos' : 'moins d\'infos'">
        </div>
    </section>
    </transition>
</template>

<script>
import share from '~/assets/img/share.svg'
import location from '~/assets/img/location.svg'
import pedestrian from '~/assets/img/walk.svg'
import downArrow from '~/assets/img/down-arrow.svg'
import upArrow from '~/assets/img/up-arrow.svg'
import smallCard from './smallCard.vue'
import axios from 'axios'

export default {
  name: 'placeCard',
  props: ['redirect', 'placeN1'],
  components: {
    'small-card': smallCard
  },
  data () {
    return {
      share,
      location,
      pedestrian,
      downArrow,
      upArrow,
      link: '/lieu/' + this.placeN1.slug.fr,
      isOpen: false,
      // isPlaceOpen: '',
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
    image () {
      let assets = this.$store.state.places['assets']
      const imageId = this.placeN1.images.fr[0].sys.id
      return assets.filter(function (image) {
        // this.placeN1.image.name.fr
        return image['sys']['id'] === imageId // mettre l'id de la placecard
      })
    },
    googlePlaceId () {
      return this.placeN1.googlePlaceId.fr
    },
    googleInfos () {
      return this.placeN1.googleInfos
    },
    isPlaceOpen () {
      if (this.placeN1.isOpenNow === undefined) console.log(this.googleInfos)
      else if (this.placeN1.isOpenNow === null) return ''
      else if (this.placeN1.isOpenNow) return 'open-dot--open'
      else return 'open-dot--closed'
    },
    distance () {
      if (this.placeN1.distance !== undefined) {
        // console.log('distance', this.placeN1.distance)
        if (this.placeN1.distance.rows[0].elements[0].status !== 'NOT_FOUND') {
          let distanceKm = this.placeN1.distance.rows[0].elements[0].distance.text
          let distance = this.placeN1.distance.rows[0].elements[0].distance.value
          // if value > 1000 -> user km units. Else use meters
          return distance >= 1000 ? distanceKm : distance + 'm'
        } else {
          return null
        }
      }
    },
    duration () {
      if (this.placeN1.distance !== undefined) {
        if (this.placeN1.distance.rows[0].elements[0].status !== 'NOT_FOUND') {
          let durationTxt = this.placeN1.distance.rows[0].elements[0].duration.text
          let duration = this.placeN1.distance.rows[0].elements[0].duration.value
          if (duration >= (24 * 3600)) {
            // if duration lasts more than one day
            // return in days
            return ''
          } else if (duration >= 3600) {
            // if duration lasts more than one hour
            return duration / 3600 + ' h'
          } else {
            return Math.round(duration / 60) + ' min'
          }
        } else {
          return null
        }
      }
    },
    isLocated () {
      return this.$store.state.geolocation['isLocated']
    }
  },
  methods: {
    toggleCardOpen () {
      this.isOpen = !this.isOpen
      // console.log('google infos', this.placeN1.googleInfos)
    },
    getGoogleInfos () {
      let payload = {placeId: this.placeN1.googlePlaceId.fr}
      this.$store.dispatch('places/getGoogleInfos', payload)
    },
    recalculateIsOpenNow () {
      this.$store.dispatch('places/recalculateIsOpenNow', this.placeN1.slug.fr)
    }
  },
  mounted () {
    if (this.placeN1.googleInfos === undefined) {
      this.getGoogleInfos()
    } else {
      // console.log('google infos already set : ', this.placeN1.googleInfos)
    }
    // set isPlaceOpen
    console.log('slug', this.placeN1.slug)
    if (this.placeN1.slug !== undefined) {
      this.recalculateIsOpenNow()
    }
    if ((this.placeN1.distance === undefined) && this.isLocated === true) {
      console.log('calculating distance...')
      this.$store.dispatch('geolocation/calculateDistance', this.placeN1)
    }
  },
  beforeMount () {
    // if (this.placeN1.distance === undefined) {
    //   console.log('calculating distance...')
    //   this.$store.dispatch('geolocation/calculateDistance', this.placeN1)
    // }
  }
}
</script>
<style scoped>
    .placeCard{
        background:white;
        box-shadow:0 2px 4px 0 rgba(0, 0, 0, 0.05);
        margin-bottom:1rem;
    }
    .card__header{
        position: relative;
    }
    .card__categories{
        position: absolute;
        bottom:1rem;
    }

    .category-tag{
        background: white;
        margin:0 0.5rem;
        padding:.35rem .75rem .25rem;
        font-size:0.8rem;
        display: inline-block;
        vertical-align: middle;
        color: black;
    }
    .placeCard__content{
        padding:0.5rem;
        color: #b5b5b5;
        display: grid;
        grid-template-rows: auto auto auto auto auto;
        grid-template-columns: 1.5rem 1fr 2rem;

    }
    .placeCard__title{
        color:black;
        text-decoration: none;
    }
    .open-dot{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 100%;
        align-self: center;
        margin-right:0.5rem;
        background:lightgrey;
    }
    .open-dot--open{
        background:#76bb71;
    }
    .open-dot--uncertain{
        background:darkorange;
    }
    .open-dot--closed{
        background:red;
    }
    .card__image--big {
        height: 10rem;
        object-fit: cover;
    }
    .card__image{
        width:100%;
    }
    .share-button{
        align-self: center;
    }
    .placeCard__details{
        grid-column: 2 / -2;
        margin-bottom: 0;
    }
    .placeCard__detail{
        margin-right:1rem;
    }
    .placeCard__suggestions{
        grid-column: 2 / -2;
    }
    .placeCard__description{
        grid-column: 2 / -2;
        margin-bottom:2rem;
    }

    .placeCard__separator{
        grid-column: 1/-1;
        border:none;
        border-bottom: 1px solid #f5f5f5;
        margin: 0 -0.5rem 1rem;
    }

    .subsection__title{
        color:#5c5c5c;
        margin-bottom:0.5rem;
    }

    .suggestions__slider{
        padding-bottom:8rem; /* should be the same than slider height, could be done via js */
        margin-bottom:1rem;
    }
    .slider__container{
        position: absolute;
        display: flex;
        align-items:center;
    }
    .slider__element{
        margin-right:0.5rem;
    }
    .placeCard__toggle{
        display: flex;
        align-items: center;
        justify-content: center;
        padding:0.5rem 0;
        border-top:1px solid #f5f5f5;
        cursor: pointer;
        //margin-top:1rem;
    }
    .my-swiper {
        height: auto;
        width: 100%;
    }
    .my-swiper--notswiper{
        position: absolute;
    }
    .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        width:auto;
    }
    .swiper-container{
        overflow: visible;
        position: absolute;
    }
</style>
