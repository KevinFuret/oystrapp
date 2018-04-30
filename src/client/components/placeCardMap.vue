<template>
    <section class="placeCardMap">
        <header class="card__header">
            <img class="card__image card__image--big" :src="image[0].fields.file.fr.url" alt="Image du lieu">
            <div class="card__categories">
                <span class="card__category category-tag" v-for="category in placeN1.placeCategory.fr">
                    {{ category.fields.nom.fr }}
                </span>
            </div>
        </header>
        <div class="placeCard__content">
            <span class="open-dot open-dot--open"></span>
            <h2 class="placeCard__title">{{ placeN1.name.fr }}</h2>
            <span class="favorite-button"><img :src="heart" alt="Ajouter/Supprimer des favoris"></span>
            <p class="placeCard__details">
                <span class="placeCard__detail"><img :src="location" alt="Distance"> 300m</span>
                <span class="placeCard__detail"><img :src="pedestrian" alt="Temps"> 4min</span>
            </p>
        </div>
    </section>
</template>

<script>
import heart from '~/assets/img/heart.svg'
import location from '~/assets/img/location.svg'
import pedestrian from '~/assets/img/walk.svg'

export default {
  name: 'placeCard',
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
      const imageId = this.placeN1.images.fr[0].sys.id
      return assets.filter(function (image) {
        // this.placeN1.image.name.fr
        return image['sys']['id'] === imageId // mettre l'id de la placecard
      })
    }
  }
}
</script>
<style>
  .placeCardMap {
      background:white;
      box-shadow:0 2px 4px 0 rgba(0, 0, 0, 0.05);
      margin-bottom:1rem;
  }
  .placeCard__content {
    min-height: 85px;
  }
</style>
