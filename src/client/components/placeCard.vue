<template>
    <section class="placeCard">
        <header class="card__header">
            <img class="card__image card__image--big" :src="image[0].fields.file.fr.url" alt="Image du lieu">
            <div class="card__categories">
                <span class="card__category category-tag" v-for="category in placeN1.placeCategory.fr">
                    {{ category.fields.nom.fr }}
                </span>
            </div>
        </header>

        <div class="placeCard__content">
            <span class="open-dot" :class="isPlaceOpen"></span>
            <h2 class="placeCard__title">{{ placeN1.name.fr }}</h2>
            <span class="favorite-button"><img :src="heart" alt="Ajouter/Supprimer des favoris"></span>
            <p class="placeCard__details">
                <span class="placeCard__detail"><img :src="location" alt="Distance"> 300m</span>
                <span class="placeCard__detail"><img :src="pedestrian" alt="Temps"> 4min</span>
            </p>
        </div>
        <p>{{ isPlaceOpen }}</p>
        <transition name="slide-down" mode="in-out">
            <div class="placeCard__content placeCard__morecontent" v-show="isOpen">
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
</template>

<script>
import heart from '~/assets/img/heart.svg'
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
      heart,
      location,
      pedestrian,
      downArrow,
      upArrow,
      isOpen: false,
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
      if (this.googleInfos === undefined) console.log(this.googleInfos)
      else if (this.googleInfos.opening_hours === undefined) return 'open-dot--uncertain'
      else if (this.placeN1.googleInfos.opening_hours.open_now === true) return 'open-dot--open'
      else return 'open-dot--closed'
    }
  },
  methods: {
    toggleCardOpen () {
      this.isOpen = !this.isOpen
      // console.log('google infos', this.placeN1.googleInfos)
    },
    getGoogleInfos () {
      // true pour recharger les infos tout le temps
      if (this.placeN1.googleInfos === undefined || true) {
        console.log('on fait la requete google places...', this.placeN1.googlePlaceId.fr)
        const placeId = this.placeN1.googlePlaceId.fr
        const proxyurl = 'https://cors-anywhere.herokuapp.com/'
        const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeId + '&key=AIzaSyAbP1t4UE9cfSuNYsmOXkRaHLVMJQHV2rQ'
        fetch(proxyurl + url)
          .then(response => response.text())
          // .then(contents => console.log('contents', contents))
          .then(contents => this.storeGoogleInfos(placeId, contents))
          .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'))
      }
    },
    storeGoogleInfos (placeId, infos) {
      const payload = {placeId: placeId, infos: JSON.parse(infos).result}
      this.$store.dispatch('places/updateGoogleInfos', payload)
    }
  },
  mounted () {
    if (this.placeN1.googleInfos === undefined) {
      this.getGoogleInfos()
    } else { console.log('google infos already set : ', this.placeN1.googleInfos) }
  }
}
</script>
<style>
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
    .favorite-button{
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
