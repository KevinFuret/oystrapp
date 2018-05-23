<template>
    <div v-if="selectionDetails">
        <header class="header header--place">
            <img class="header__image" :src="image" alt="Image du lieu">
        </header>
        <div class="selection-details">
            <p class="selection-details__author">
                <img class="selection-details__author-image" :src="selectionDetails.authorImage.fr.fields.file.fr.url">
                <span class="selection-details__author-name">{{ selectionDetails.authorName.fr }}</span> a créé
            </p>
            <a href="" alt="share" class="selection-details__share share-button">
                <img :src="share" class="share-button__image" alt="Partager ce lieu avec vos amis">
            </a>
            <h1 class="selection-details__title">{{ selectionDetails.name.fr }}</h1>
            <div class="selection-details__description">
                {{ selectionDetails.description.fr }}
            </div>
        </div>
        <div class="selection-details__places">
            <h4>Lieux ({{ placesNb }})</h4>
            <ul class="placesList">
                <li class="place" v-if="places.length > 0"
                    v-for="place in places" :key="place.sys.id" >
                    <place-card v-bind:placeN1="place.fields"></place-card>
                </li>
            </ul>
        </div>


    </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import share from '~/assets/img/share.svg'
  import placeCard from '~/components/placeCard.vue'
  import * as VueGeolocation from 'vue-browser-geolocation'

  export default {
    layout: 'fullscreen',
    components: {
      'place-card': placeCard
    },
    data () {
      return {
        slug: this.$route.params.selectionSlug,
        selectionDetails: '',
        share,
        places: []
        /* swiperOption: {
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
        } */
      }
    },
    computed: {
      ...mapGetters({
        selections: 'places/getSelections',
        placesN1: 'places/getPlacesN1',
        getSelectionBySlug: 'places/getSelectionBySlug',
        getPlaceBySlug: 'places/getPlaceN1BySlug'
      }),
      image () {
        return this.selectionDetails.image.fr.fields.file.fr.url
      },
      placesNb () {
        return this.selectionDetails.places.fr.length
      }
    },
    methods: {
      getSelectionDetails () {
        let selection = this.getSelectionBySlug(this.slug)
        selection = selection[0].fields
        this.selectionDetails = selection
        const vm = this // to use this keyword in foreach
        selection.places.fr.forEach(function(el) {
          console.log(vm.getPlaceBySlug(el.fields.slug.fr)[0])
          vm.places.push(vm.getPlaceBySlug(el.fields.slug.fr)[0])
        })
      },
      setUserPosition () {
        // ask user location
        // if he accepts, we populate the store
        // TODO : ask at the end of the onboarding

        // navigator.geolocation.getCurrentPosition(e => {
        //   console.log(e)
        //   let userPosition = e
        //   this.$store.dispatch('geolocation/setUserPosition', { userPosition })
        //
        // })

        this.$getLocation()
          .then(coordinates => {
            let userPosition = coordinates
            this.$store.dispatch('geolocation/setUserPosition', { userPosition })
          })
          .catch(error => {
            // console.log(error)
            this.$store.dispatch('geolocation/displayDistance', false )
          })
      },
      async manageStoreContentful () {
        if (this.$store.state.places['entries'].length === 0) {
          // call the Contentful API to get entries and use store management
          const data = await this.$store.dispatch('places/fetchAllPlaces')
        } else {
          // sync modifications
          console.log('syncing ?')
          let savedToken = this.$store.state.places['token']
          const data = await this.$store.dispatch('places/updateContent', { savedToken })
        }
      }
    },
    mounted: async function () {
      this.setUserPosition()
      this.manageStoreContentful() // put in beforeMount ?
      this.getSelectionDetails()
      console.log(this.places.length)
    },
    watch: {
      userPosition(newPosition, oldPosition) {
        console.log('newPosition', newPosition)
        // this.$store.dispatch('geolocation/watchUserPosition', { newPosition } )
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
    .selection-details{
        display: grid;
        grid-template-columns: auto 30px;
        grid-template-rows: auto auto;
        padding: 0.5rem;
    }
    .selection-details__share{
        align-self: center;
        justify-self:center;
        height:20px;
    }
    .selection-details__title{
        font-size: 1.72rem;
        line-height:normal;
        grid-column: 1 / -1;
        margin-top:1.5rem;
    }
    .selection-details__author{
        display: flex;
        align-items: center;
        color: #c7c7cc;
        margin:0;
    }
    .selection-details__author-image{
        width:25px;
        height:25px;
        border-radius: 100%;
        margin-right:0.5rem;
    }
    .selection-details__author-name{
        margin-right:0.3rem;
        color: black;
    }
    .selection-details__description{
        margin:1rem 0;
        font-size:16px;
        grid-column: 1 / -1;
    }
    .selection-details__places{
        border-top:1px solid #c7c7c7;
        margin-left:-0.6rem;
        margin-right:-0.6rem;
        padding:1rem;
    }
    .placesList{
        max-width: 100%;
        list-style-type: none;
        margin-top:1rem;
    }
    .placesList a{
        text-decoration: none;
    }
</style>
