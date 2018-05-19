<template>
    <v-layout>
        <section>
            <ul class="selectionsList">
                <li class="selection"
                v-for="selection in selections"
                :key="selection.id">
                    nom : {{ selection.fields.name.fr }}
                    auteur : {{ selection.fields.authorName.fr }}
                </li>
            </ul>
        selections {{ hello }}
        </section>
    </v-layout>
</template>
<script>
  import { mapGetters } from 'vuex'
export default {
    data () {
      return {
        hello: 'hello!'
      }
    },
    computed: {
      ...mapGetters({
        selections: 'places/getSelections',
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
<style>

</style>