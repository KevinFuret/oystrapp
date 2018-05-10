<template>
    <div class="place-info-block" :class="this.type">
        <div class="place-info-block__icon">
            <img :src="icon" :alt="icon">
        </div>
        <div class="place-info-block__text" v-if="this.type !== 'hours'"
             v-html="content.contentOpen">
        </div>
        <div class="place-info-block__text place-info-block__text--closed" v-else>
            <span class="place-info-block__opennow">{{ contentOpen }}</span>
            <transition name="slide-down" mode="in-out">
                <div class="place-info-block--more" v-if="canBeOpened" v-show="isOpen">
                    <span v-for="day in days" class="hours__day">
                        {{ day }}
                    </span>

                </div>
            </transition>
        </div>
        <div class="place-info-block__map" v-if="content.urlMap">
            <a :href="content.urlMap" target="_blank" class="map__link">
                <img :src="itinerary" alt="Cliquer pour lancer l'itinéraire" >
            </a>
        </div>
        <div class="place-info-block__toggle" v-if="this.type === 'hours'" @click.stop="isOpen = !isOpen">
            <img class="toggle__arrow" :src="isOpen ? upArrow : downArrow" :alt="isOpen ? 'plus d\'infos' : 'moins d\'infos'">
        </div>

    </div>
</template>
<script>
import address from '~/assets/img/address.svg'
import price from '~/assets/img/price.svg'
import hours from '~/assets/img/opening_hours.svg'
import itinerary from '~/assets/img/itinerary.svg'
import downArrow from '~/assets/img/down-arrow.svg'
import upArrow from '~/assets/img/up-arrow.svg'

export default {
  props: [
    'type', // address, price, opening_hours
    'content',
    'canBeOpened'
  ],
  data () {
    return {
      isOpen: false,
      isPlaceOpen: '',
      openNowClass: '',
      address,
      price,
      hours,
      itinerary,
      downArrow,
      upArrow
    }
  },
  computed: {
    icon () {
      if (this.type === 'address') return address
      else if (this.type === 'price') return price
      else if (this.type === 'hours') return hours
    },
    contentOpen () {
      if (this.type === 'hours') {
        if (this.content.contentOpen) {
          this.isPlaceOpen = true
          this.openNowClass = 'place-info-block__opennow--open'
          return 'Ouvert actuellement'
        } else {
          this.openNowClass = 'place-info-block__opennow--closed'
          this.isPlaceOpen = false
          return 'Fermé actuellement'
        }
      }
      return ''
    },
    days () {
      if (this.type === 'hours') {
        return this.content.contentClosed
      }
    },
    mapsLink () {
      return ''
    }
  }
}
</script>
<style>
.place-info-block{
    border-bottom:1px solid #b5b5b5;
    margin-left:-0.5rem;
    margin-right:-0.5rem;

    display: grid;
    grid-template-columns: 30px auto auto;
    align-items: center;
    font-size:16px;
}
.place-info-block:first-child{
    border-top:1px solid #b5b5b5;
}

.place-info-block__text,
.place-info-block__icon{
    padding:1.5rem 1rem;
}

.place-info-block.price .place-info-block__text{
    white-space: pre;
}
.place-info-block__more{
    justify-self: end;
}
.place-info-block__map,
.map__link,
.map__link img{
    height:100%;
}
.place-info-block__toggle{
    padding:1.5rem 1rem;
    justify-self: end;
    align-self:start;
}
.hours__day{
    display: block;
}
.place-info-block__opennow{
    font-weight:bold;
}
.place-info-block__opennow--open{
    color:green;
}
.place-info-block__opennow--closed{
    color:darkred;
}
</style>
