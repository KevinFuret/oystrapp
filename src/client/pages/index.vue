<template>
  <v-container fluid>
    <v-layout justify-center align-center>
      <v-flex xs12 sm10 md8 lg6 xl6>
        <v-container v-if="$store.state.user.isAuthenticated">
          <h3 class="text-xs-center">Vueniverse<v-btn class="xs-center" router :to="{ name: 'users-username', params: { username: this.$store.state.user.username } }">
            view your profile.
          </v-btn></h3>
          <!-- <img id="logo" :src="vueniverseLogo" alt="vueniverse_logo.svg"> -->
          <!-- <textarea name="localstorage" class="localstorage" rows="8" cols="80"></textarea> -->
          <!-- <button class="empty">Empty localStorage</button> -->
          {{ token }}
        </v-container>
        <v-container v-else align="center">
          <h3 class="text-xs-center">Vueniverse</h3>
          <img id="logo" :src="vueniverseLogo" alt="vueniverse_logo.svg">
          <h4>Source code</h4>
          <a href="https://vueniverse.now.sh/_src" target="_blank"><h5>NOW</h5></a>
          <a href="https://www.github.com/rlindskog/vueniverse" target="_blank"><h5>Github</h5></a>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import myPlugin from '~/plugins/persistedState'
// import { mapActions } from 'vuex'
import vueniverseLogo from '~/assets/img/vueniverse_logo.svg'

export default {
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
