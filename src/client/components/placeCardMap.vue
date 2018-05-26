<template>
    <section class="placeCardMap">
        <nuxt-link :to="link">
          <header class="card__header">
              <img class="card__image card__image--big" :src="image[0].fields.file.fr.url" alt="Image du lieu">
              <div class="card__categories">
                  <span class="card__category category-tag" v-for="category in placeN1.fields.placeCategory.fr">
                      {{ category.fields.nom.fr }}
                  </span>
              </div>
          </header>
        </nuxt-link>

      <div class="placeCard__content placeCard__content--preview">
          <span class="open-dot" :class="isPlaceOpen"></span>
          <nuxt-link :to="link">
            <h2 class="placeCard__title">{{ placeN1.fields.name.fr }}</h2>
          </nuxt-link>
          <share :title="placeN1.fields.name.fr" :description="placeN1.fields.description.fr" direction="left"></share>
          <p class="placeCard__details" v-if="isLocated === true">
              <nuxt-link :to="link">
                  <span class="placeCard__detail" v-if="distance !== null"><img :src="location" alt="Distance"> {{ distance }} </span>
                  <span class="placeCard__detail" v-if="duration !== null"><img :src="pedestrian" alt="Temps"> {{ duration }}</span>
              </nuxt-link>
          </p>
      </div>

    </section>
</template>

<script>
import share from './share.vue'
import location from '~/assets/img/location.svg'
import pedestrian from '~/assets/img/walk.svg'
import { SocialSharing } from '~/plugins/vue-social-sharing.js'

export default {
  name: 'placeCardMap',
  props: ['redirect', 'placeN1'],
  components: {
    share
  },
  data () {
    return {
      location,
      pedestrian,
      link: '/lieu/' + this.placeN1.fields.slug.fr
    }
  },
  computed: {
    image () {
      let assets = this.$store.state.places['assets']
      const imageId = this.placeN1.fields.images.fr[0].sys.id
      return assets.filter(function (image) {
        // this.placeN1.image.name.fr
        return image['sys']['id'] === imageId // mettre l'id de la placecard
      })
    },
    isPlaceOpen () {
      if (this.placeN1.fields.isOpenNow === undefined) console.log(this.googleInfos)
      else if (this.placeN1.fields.isOpenNow === null) return ''
      else if (this.placeN1.fields.isOpenNow) return 'open-dot--open'
      else return 'open-dot--closed'
    },
    distance () {
      if (this.placeN1.fields.distance !== undefined) {
        if (this.placeN1.fields.distance.rows[0].elements[0].status !== 'NOT_FOUND') {
          let distanceKm = this.placeN1.fields.distance.rows[0].elements[0].distance.text
          let distance = this.placeN1.fields.distance.rows[0].elements[0].distance.value
          // if value > 1000 -> user km units. Else use meters
          return distance >= 1000 ? distanceKm : distance + 'm';
        } else return null
      } else return null
    },
    duration () {
      if (this.placeN1.fields.distance !== undefined) {
        if (this.placeN1.fields.distance.rows[0].elements[0].status !== 'NOT_FOUND') {
          let duration = this.placeN1.fields.distance.rows[0].elements[0].duration.value
          if (duration >= (24 * 3600)) {
            // if duration lasts more than one day
            // return nothing
            return null
          } else if (duration >= 3600) {
            // if duration lasts more than one hour
            return duration / 3600 + ' h'
          } else {
            return Math.round(duration / 60) + ' min'
          }
        } else return null
      } else return null
    },
    isLocated () {
      return this.$store.state.geolocation['isLocated']
    }
  },
  mounted () {
    this.recalculateIsOpenNow()

    if ((this.placeN1.distance === undefined || true) && this.isLocated === true) {
      this.$store.dispatch('geolocation/calculateDistance', this.placeN1.fields)
    }
  },
  methods: {
    recalculateIsOpenNow () {
      this.$store.dispatch('places/recalculateIsOpenNow', this.placeN1.fields.slug.fr)
    }
  }
}
</script>
<style scoped>
  .placeCardMap {
      background:white;
      box-shadow:0 2px 4px 0 rgba(0, 0, 0, 0.05);
      margin-bottom: 0;
  }
  .placeCardMap a{
      text-decoration: none !important;
      color: inherit !important;
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
      width: 100%;
      object-fit: cover;
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

  a {
    text-decoration: none;
  }
</style>
