<template>
    <section class="placeCardMap">
        <header class="card__header">
            <img class="card__image card__image--big" :src="image[0].fields.file.fr.url" alt="Image du lieu">
            <div class="card__categories">
                <span class="card__category category-tag" v-for="category in placeN1.fields.placeCategory.fr">
                    {{ category.fields.nom.fr }}
                </span>
            </div>
        </header>
        <div class="placeCard__content">
            <span class="open-dot open-dot--open"></span>
            <h2 class="placeCard__title">{{ placeN1.fields.name.fr }}</h2>
            <span class="favorite-button"><img :src="heart" alt="Ajouter/Supprimer des favoris"></span>
            <p class="placeCard__details">
                <span class="placeCard__detail"><img :src="location" alt="Distance"> {{ distance }} </span>
                <span class="placeCard__detail"><img :src="pedestrian" alt="Temps"> {{ duration }}</span>
            </p>
        </div>
    </section>
</template>

<script>
import heart from '~/assets/img/heart.svg'
import location from '~/assets/img/location.svg'
import pedestrian from '~/assets/img/walk.svg'

export default {
  name: 'placeCardMap',
  props: ['redirect', 'placeN1'],
  data () {
    return {
      heart,
      location,
      pedestrian
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
    distance () {
      let distanceKm = this.placeN1.fields.distance.rows[0].elements[0].distance.text
      let distance = this.placeN1.fields.distance.rows[0].elements[0].distance.value
      // if value > 1000 -> user km units. Else use meters
      // console.log(this.placeN1.fields.distance.rows[0].elements)
      if (distance >= 1000) {
        return distanceKm
      } else {
        return distance + "m"
      }
    },
    duration () {
      let durationTxt = this.placeN1.fields.distance.rows[0].elements[0].duration.text
      let duration = this.placeN1.fields.distance.rows[0].elements[0].duration.value
      if( duration >= ( 24*3600 ) ) {
        // if duration lasts more than one day
        // return in days
        return durationTxt
      } else if ( duration >= 3600) {
        // if duration lasts more than one hour
        return duration / 3600 + ' h'
      } else {
        return Math.round(duration / 60) + ' min'
      }
    }
  }
}
</script>
<style>
  .placeCardMap {
      background:white;
      box-shadow:0 2px 4px 0 rgba(0, 0, 0, 0.05);
      margin-bottom: 0;
  }
  .placeCard__content {
    min-height: 80px;
  }
</style>
