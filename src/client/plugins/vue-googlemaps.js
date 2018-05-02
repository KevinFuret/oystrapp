import Vue from 'vue'
import 'vue-googlemaps/dist/vue-googlemaps.css'
import VueGoogleMaps from 'vue-googlemaps'

Vue.use(VueGoogleMaps, {
  load: {
    apiKey: 'AIzaSyDHODaToJWZzf-2CBLaMZqggaoasjY1QeU',
    libraries: ['geometry']
  },
});
