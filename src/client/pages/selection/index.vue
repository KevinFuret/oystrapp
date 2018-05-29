<template>
    <v-layout>
        <ul class="selectionsList">
            <selection class="selection"
            v-for="selection in selections"
            :key="selection.sys.id"
            :selection="selection">
            </selection>
        </ul>
    </v-layout>
</template>
<script>
  import { mapGetters } from 'vuex'
  import selection from '~/components/selection.vue'
export default {
    components: {
      selection
    },
    data () {
      return {
        hello: 'hello!'
      }
    },
    computed: {
      ...mapGetters({
        selections: 'places/getSelections', // TODO : n'est pas réactif je ne comprend pas
        placesN1: 'places/getPlacesN1',
        userPosition: 'geolocation/getUserPosition'
      })
    },
    methods: {
      async manageStoreContentful () {
        if (this.$store.state.places['entries'].length === 0) {
          // call the Contentful API to get entries and use store management
          const data = await this.$store.dispatch('places/fetchAllPlaces')
        } else {
          // sync modifications
          console.log('syncing ?')
          let savedToken = this.$store.state.places['token']
          const data = await this.$store.dispatch('places/updateContent', {savedToken})
        }
      }
    },
    mounted: async function () {
      this.manageStoreContentful()
    }
}
</script>
<style scoped>
.selectionsList{
    width:100%;
    margin-top:1rem;
}
</style>