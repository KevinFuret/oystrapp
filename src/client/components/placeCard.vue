<template>
    <section class="placeCard">
        <header class="card__header">
            <img class="card__image" :src="imagePlaceholder" alt="Image du lieu">
            <div class="card__categories">
                <span class="card__category category-tag">Architecture</span>
                <span class="card__category category-tag">Musée</span>
            </div>
        </header>
        <div class="placeCard__content">
            <span class="open-dot open-dot--open"></span>
            <h2 class="placeCard__title">musée des beaux arts</h2>
            <span class="favorite-button"><img :src="heart" alt="Ajouter/Supprimer des favoris"></span>
            <p class="placeCard__details">
                <span class="placeCard__detail"><img :src="location" alt="Distance"> 300m</span>
                <span class="placeCard__detail"><img :src="pedestrian" alt="Temps"> 4min</span>
            </p>
        </div>
        <div class="placeCard__content placeCard__morecontent">
            <p class="placeCard__description">Un château, un musée, des expos, des jardins aménagés et les remparts pour se promener… passage obligatoire pour les non-initiés !</p>
            <hr class="placeCard__separator">
            <div class="placeCard__suggestions">
                <h3 class="subsection__title">Et pour la suite ?</h3>
                <div class="suggestions__slider">
                    <div class="slider__container">
                        <small-card class="slider__element"></small-card>
                        <small-card class="slider__element"></small-card>
                        <small-card class="slider__element"></small-card>
                    </div>
                </div>
            </div>
        </div>
        <div class="placeCard__toggle">
            <img class="toggle__arrow" :src="downArrow" alt="plus / moins d'infos">
        </div>
    </section>
</template>

<script>
import imagePlaceholder from '~/assets/img/musee-placeholder.png'
import heart from '~/assets/img/heart.svg'
import location from '~/assets/img/location.svg'
import pedestrian from '~/assets/img/walk.svg'
import downArrow from '~/assets/img/down-arrow.svg'
import upArrow from '~/assets/img/up-arrow.svg'
import smallCard from './smallCard.vue'

export default {
  name: 'placeCard',
  props: ['redirect'],
  components: {
    'small-card': smallCard
  },
  data () {
    return {
      imagePlaceholder,
      heart,
      location,
      pedestrian,
      downArrow,
      upArrow
    }
  }
}
</script>
<style>
    .placeCard{
        background:white;
        box-shadow:0 2px 4px 0 rgba(0, 0, 0, 0.05);
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
</style>
