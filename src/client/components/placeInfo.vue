<template>
    <div class="place-info-block" :class="this.type" @click.stop="isOpen = !isOpen">
        <div class="place-info-block__icon">
            <img :src="icon" :alt="icon">
        </div>
        <div class="place-info-block__text" v-if="this.type !== 'hours'"
             v-html="content.contentOpen">
        </div>
        <div class="place-info-block__text place-info-block__text--closed" v-else>
            <span class="place-info-block__opennow" :class="openNowClass">{{ contentOpen }}</span>
            <transition name="slide-down" mode="in-out">
                <div class="place-info-block--more" v-if="canBeOpened" v-show="isOpen">
                    <p v-for="day in days" class="opening-hours__line">
                        <span class="opening-hours__day">{{ day[0] }}</span>
                        <span class="opening-hours__hours">
                            <span v-for="period in day[1]" class="opening-hours__period">
                                {{ period }}
                            </span>
                        </span>
                    </p>

                </div>
            </transition>
        </div>
        <div class="place-info-block__map" v-if="content.urlMap">
            <a :href="content.urlMap" target="_blank" class="map__link">
                <img :src="itinerary" alt="Cliquer pour lancer l'itinéraire" >
            </a>
        </div>
        <div class="place-info-block__toggle" v-if="this.type === 'hours'" >
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
        let days = []
        this.content.contentClosed.forEach(function (day) {
          days.push(day.split(/: (.+)/))
        })
        days.forEach(function (day){
          day[1] = day[1].split(/, /)
        })
        return days
      }
    },
    mapsLink () {
      return ''
    }
  },
  methods: {
    getGoogleInfos () {
      // true pour recharger les infos tout le temps
      if (this.placeDetails.googleInfos === undefined) {
        // console.log('on fait la requete google places...', this.placeN1.googlePlaceId.fr)
        const placeId = this.placeN1.googlePlaceId.fr
        const proxyurl = 'https://cors-anywhere.herokuapp.com/'
        const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeId + '&key=AIzaSyAbP1t4UE9cfSuNYsmOXkRaHLVMJQHV2rQ'
        fetch(proxyurl + url)
          .then(response => response.text())
          // .then(contents => console.log('contents', contents))
          .then(contents => this.storeGoogleInfos(placeId, contents))
          .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'))
      }
    },
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
    white-space: pre-line;
}
.place-info-block--more{
    justify-self: end;
    margin-top: 1rem;
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

    display: inline-block;
}
.place-info-block__opennow--open{
    color:#74A741;
}
.place-info-block__opennow--closed{
    color:#C42D2D;
}
.opening-hours__line{
    margin-bottom:0.5rem;
    display: grid;
    grid-template-columns: 90px 1fr;
    text-align: left;
}
.opening-hours__day{
    font-weight:bold;
}
.opening-hours__period{
    display: block;
}
</style>
