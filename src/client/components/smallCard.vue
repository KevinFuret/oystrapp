<template>
    <div class="smallCard placeCard">
        <header class="card__header">
            <img class="card__image smallCard__image" :src="image[0].fields.file.fr.url" alt="Image du lieu">
            <div class="card__categories">
                <span class="card__category category-tag">{{ placeDetails.fields.category.fr.fields.name.fr }}</span>
            </div>
        </header>
        <div class="smallCard__content">
            <span class="open-dot open-dot--open"></span>
            <p class="smallCard__title">{{ placeDetails.fields.name.fr }}</p>
        </div>
    </div>
</template>
<script>
  import smallImagePlaceholder from '~/assets/img/musee-small-placeholder.png'
  export default {
    name: 'placeCard',
    props: ['placeDetails'],
    data () {
      return {
        smallImagePlaceholder
      }
    },
    mounted () {
      console.log('place details', this.placeDetails.fields)
    },
    computed: {
      image () {
        let assets = this.$store.state.places['assets']
        const imageId = this.placeDetails.fields.image.fr[0].sys.id
        return assets.filter(function (image) {
          // this.placeN1.image.name.fr
          return image['sys']['id'] === imageId // mettre l'id de la placecard
        })
      }
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
</style>