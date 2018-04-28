<template>
    <div class="filters">
        <p>selected categories (all by default): {{ selectedCategories }}</p>
        <h2>click on a category to filter the places : </h2>
        <ul class="filtersList">
            <li v-for="category in categories" class="filter" :key="category.fields.nom.fr">
                <p><button @click="updateSelectedPlaces" :name="category.fields.slug.fr">{{ category.fields.slug.fr }}</button></p>
                <!--TO SHOW IMAGE</p>-->
                <!--<p v-if="category.fields.image">{{ category.fields.image.fr.fields.file.fr.url }}</p>-->
            </li>
        </ul>
        <hr>

    </div>
</template>

<script>
  export default {
    computed: {
      entries () {
        return this.$store.state.places['entries']
      },
      selectedPlaces () {
        return this.$store.state.places['selectedPlaces']
      },
      selectedCategories () {
        return this.$store.state.places['selectedCategories']
      },
      categories () {
        let entries = this.entries
        return entries.filter( function (categories) {
          return categories['sys']['contentType']['sys']['id'] === 'category'
        })
      },
      placesN1 () {
        let entries = this.$store.state.places['entries']
        return entries.filter( function (placeN1) {
          return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
        })
      }
    },
    methods: {
      updateSelectedPlaces (event) {
        const category = event.target.name
        this.$store.dispatch('places/toggleCategory', { category })
      }
    },
    mounted () {
      // console.log('this.entries', this.entries)
    }
  }
</script>
<style>

</style>