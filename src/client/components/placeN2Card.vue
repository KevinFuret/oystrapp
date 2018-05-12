<template>
    <div class="placeN2Card">
        <header class="card__header">
            <img class="card__image placeN2Card__image" :src="image[0].fields.file.fr.url" alt="Image du lieu">
            <div class="card__categories">
                <span class="card__category category-tag">{{ placeDetails.fields.category.fr.fields.name.fr }}</span>
            </div>
        </header>
        <div class="placeN2Card__content">
            <span class="open-dot open-dot--open"></span>
            <h4 class="placeN2Card__title">{{ placeDetails.fields.name.fr }}</h4>
            <a href="" alt="share" class="details__share share-button">
                <img :src="share" class="share-button__image" alt="Partager ce lieu avec vos amis">
            </a>
            <div class="placeN2Card__description">{{ placeDetails.fields.description.fr }}</div>
        </div>
    </div>
</template>
<script>
  import smallImagePlaceholder from '~/assets/img/musee-small-placeholder.png'
  import share from '~/assets/img/share.svg'

  export default {
    name: 'placeCard',
    props: ['placeDetails'],
    data () {
      return {
        smallImagePlaceholder,
        share
      }
    },
    mounted () {
      // console.log('place details', this.placeDetails.fields)
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
    .card__header{
        position: relative;
    }
    .card__categories{
        position: absolute;
        bottom:1rem;
    }
    .placeN2Card{
        width: 300px;
        box-sizing: border-box;
        margin-right:0.5rem;
        background:white;
        box-shadow:0 2px 4px 0 rgba(0, 0, 0, 0.05);
        margin-bottom:1rem;
    }
    .placeN2Card__image{
        width:100%;
        height: 9rem;
        object-fit: cover;
    }
    .placeN2Card__content{
        padding:0.5rem;
        color: #b5b5b5;
        display: grid;
        grid-template-rows: auto auto auto auto auto;
        grid-template-columns: 1.5rem 1fr 2rem;
    }
    .placeN2Card__title{
        color:black;
        font-weight:bold;
        width:100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin:0;
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
    .share-button{
        align-self: center;
    }
    .placeN2Card__description{
        grid-column: 2 / -2;
        margin-bottom: 1rem;
    }
</style>