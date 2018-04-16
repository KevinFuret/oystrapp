<template>
  <v-container fluid>
    <v-layout justify-center align-center>
      <v-flex xs12 sm10 md8 lg6 xl6>
        <v-container v-if="$store.state.user.isAuthenticated">
          <h3 class="text-xs-center">Vueniverse<v-btn class="xs-center" router :to="{ name: 'users-username', params: { username: this.$store.state.user.username } }">
            view your profile.
          </v-btn></h3>
          <!-- <img id="logo" :src="vueniverseLogo" alt="vueniverse_logo.svg"> -->
          <textarea name="localstorage" class="localstorage" rows="8" cols="80"></textarea>
          <button class="empty">Empty localStorage</button>

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
// import {createClient} from '~/plugins/contentful'
import vueniverseLogo from '~/assets/img/vueniverse_logo.svg'

// const client = createClient()

export default {
  data () {
    return {
      vueniverseLogo
    }
  },
  async mounted () {
    // execute localstorage checking only on the client side
    if (process.browser) {
      // await this.$localForage.setItem('test', 'hello world')
      // let item = await localStorage.getItem('contentfulSyncToken')
      const contentful = require('contentful')
      const client = contentful.createClient({
       accessToken: '66fa3b0ec654c9fa055e51ee1173b20f40a9da6176bbfec90844537d30ba7dd0',
       space: 'hdmawp3eaozi'
      })
      let demo = document.querySelector('.localstorage')

      if (window.localStorage.getItem('contentfulSyncToken') === null) {
        console.log("localStorage is empty")
        // retrieve content of the space and push it in localStorage
        client.sync({initial: true})
          .then((response) => {
             const responseObj = JSON.parse(response.stringifySafe());
             // console.log(responseObj);
             const entries = responseObj.entries;
             window.localStorage.setItem('contentfulEntries', JSON.stringify(entries))
             // store le token, important pour la prochaine synchronisation
             window.localStorage.setItem('contentfulSyncToken', response.nextSyncToken)
          })
      } else {
        // sync modifications

        client.sync({nextSyncToken: window.localStorage.getItem('contentfulSyncToken')})
        .then((response) => {
          console.log('localstorage is not empty ');
          console.log(response.entries)
          console.log(response.assets)
          console.log(response.deletedEntries)
          console.log(response.deletedAssets)
          demo.value = localStorage['contentfulEntries']

          // store the new token
          window.localStorage.setItem('contentfulSyncToken', response.nextSyncToken)
        })
      }
      // display only museums

      // clear localstorage
      document.querySelector('.empty').onclick = function () {
        demo.value = ""
        localStorage.clear()
      }
    }
  }
  // copied from pages/users/index
  // fetch ({ store }) {
  //   // console.log('Content' + store.dispatch('fetchContentfulEntries'))
  //   return store.dispatch('fetchContentfulEntries')
  // }
}
</script>
