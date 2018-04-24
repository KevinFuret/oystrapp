<template>
    <div class="smallCard placeCard">
        <header class="card__header">
            <img class="card__image smallCard__image" :src="smallImagePlaceholder" alt="Image du lieu">
            <div class="card__categories">
                <span class="card__category category-tag">{{ placeDetails[0].fields.category.fr.fields.name.fr }}</span>
            </div>
        </header>
        <div class="smallCard__content">
            <span class="open-dot open-dot--open"></span>
            <p class="smallCard__title">{{ placeDetails[0].fields.name.fr }}</p>
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
      console.log('place details', this.placeDetails[0].fields)
    }
  }
</script>
<style>
    .smallCard{
        width: 125px;
        box-sizing: border-box;
    }
    .smallCard__image{
        width:100%;
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