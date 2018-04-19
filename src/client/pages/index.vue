<template>
    <v-layout>
        <place-card></place-card>
    </v-layout>
</template>

<script>
// import myPlugin from '~/plugins/persistedState'
// import { mapActions } from 'vuex'
import placeCard from '../components/placeCard.vue'

export default {
  components: {
    'place-card': placeCard
  },
  fetch ({ store }) {
    // if the localStorage corresponding to oystrPlace is empty
    if (store.state.places['lieux'].length === 0) {
      console.log("doesnt exist");
      // call the Contentful API to get entries and use store management
      return store.dispatch('places/fetchAllPlaces')
    } else {
      // sync modifications
      console.log("exist");
    }
  },
  computed: {
    lieux () {
      return this.$store.state.places['lieux']
    },
    token () {
      return this.$store.state.places['token']
    }
  }

  // async mounted () {
  //   let demo = document.querySelector('.localstorage')
  //
  //   if (window.localStorage.getItem('contentfulSyncToken') === null) {
  //     console.log("localStorage is empty")
  //     // retrieve content of the space and push it in localStorage
  //     client.sync({initial: true})
  //       .then((response) => {
  //          const responseObj = JSON.parse(response.stringifySafe());
  //          // console.log(responseObj);
  //          const entries = responseObj.entries;
  //          window.localStorage.setItem('contentfulEntries', JSON.stringify(entries))
  //          // store le token, important pour la prochaine synchronisation
  //          window.localStorage.setItem('contentfulSyncToken', response.nextSyncToken)
  //       })
  //   } else {
  //     // sync modifications
  //     client.sync({nextSyncToken: window.localStorage.getItem('contentfulSyncToken')})
  //     .then((response) => {
  //       console.log('localstorage is not empty ');
  //       console.log(response.entries)
  //       console.log(response.assets)
  //       console.log(response.deletedEntries)
  //       console.log(response.deletedAssets)
  //       demo.value = localStorage['contentfulEntries']
  //
  //       // store the new token
  //       window.localStorage.setItem('contentfulSyncToken', response.nextSyncToken)
  //     })
  //   }
  //
  //   // clear localstorage
  //   document.querySelector('.empty').onclick = function () {
  //     demo.value = ""
  //     localStorage.clear()
  //   }
  // }
}
</script>
