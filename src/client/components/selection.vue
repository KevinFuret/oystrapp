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
        <div class="selection__places__container">
            <div class="selection__places">
                <div v-swiper:selectionSwiper="selectionSwiperOption" class="my-swiper-selection" v-if="selection.fields.places.fr.length > 2">
                    <div class="swiper-wrapper">
                        <selection-place class="swiper-slide"
                                         v-for="place in selection.fields.places.fr"
                                         :key="place.sys.id"
                                         :place="place">
                        </selection-place>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>
<script>
  import smallImagePlaceholder from '~/assets/img/musee-small-placeholder.png'
  import selectionPlace from './selectionPlace.vue'
  import { EventBus } from '~/plugins/event-bus.js'

  export default {
    props: ['selection'],
    components: {
      'selection-place': selectionPlace
    },
    data () {
      return {
        smallImagePlaceholder,
        link: '/selection/' + this.selection.fields.slug.fr,
        selectionSwiperOption: {
          init: true,
          slidesPerView: 'auto',
          spaceBetween: 10,
          slidesOffsetAfter: 0, // empêche que le slider s'arrête au milieu de la dernière card,
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
    mounted () {
      EventBus.$off('i-got-clicked')
      EventBus.$off('i-got-swiped')
    }
  }
</script>
<style scoped>
    .selection {
      padding: 0.5rem;
    }
    .selection__link{
        text-decoration: none;
        color: inherit;
    }
    .selection__header{
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto auto;
        width:100%;

    }
    .selection__title{
        color: black;
    }
    .selection__link-text{
        align-self: center;
        justify-self: end;
        margin:0;
        color: #C7C7CC;
    }
    .selection__author{
        grid-row: 2 / -1;
        color: #C7C7CC;
    }
    .author__name{
        color:black;
    }
    .selection__places{
        /*position: absolute;*/
    }
    .swiper-container{
        overflow: visible;
    }
</style>
