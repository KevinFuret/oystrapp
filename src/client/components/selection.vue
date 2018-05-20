<template>
    <li class="selection">
        <nuxt-link :to="link" class="selection__link">
            <header class="selection__header">
                <h2 class="selection__title">{{ selection.fields.name.fr }}</h2>
                <p class="selection__link-text">Découvrir</p>
                <p class="selection__author">
                    créé par
                    <span class="author__name">{{ selection.fields.authorName.fr }}</span>
                </p>
            </header>
        </nuxt-link>
        <div class="selection__places">
            <div v-swiper:mySwiper="swiperOption" class="my-swiper" v-if="selection.fields.places.fr.length > 1">
                <div class="swiper-wrapper">
                    <selection-place class="swiper-slide"
                                     v-for="place in selection.fields.places.fr"
                                     :key="place.sys.id"
                                     :place="place">
                    </selection-place>
                </div>
            </div>
        </div>

    </li>
</template>
<script>
  import smallImagePlaceholder from '~/assets/img/musee-small-placeholder.png'
  import selectionPlace from './selectionPlace.vue'
  export default {
    props: ['selection'],
    components: {
      'selection-place': selectionPlace
    },
    data () {
      return {
        smallImagePlaceholder,
        link: '/selection/' + this.selection.fields.slug.fr,
        swiperOption: {
          // init:false,
          slidesPerView: 'auto',
          spaceBetween: 0,
          freeMode: true,
          slidesOffsetAfter: 85, // empêche que le slider s'arrête au milieu de la dernière card
        }
      }
    },
    mounted () {
      // console.log('place details', this.placeDetails.fields)
    }
  }
</script>
<style>
    .smallCard{
        width: 125px;
        box-sizing: border-box;
        margin-right:0.5rem;
    }
    .smallCard__image{
        width:100%;
        height: 5.6rem;
        object-fit: cover;
    }
    .smallCard__content{
        display: flex;
        align-items:center;
        padding: 0 .5rem .5rem;
    }
    .smallCard__title{
        color:black;
        width:100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin:0;
    }
    .placeN2Card__link{
        text-decoration: none;
    }
</style>