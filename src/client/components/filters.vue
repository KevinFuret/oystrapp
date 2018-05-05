<template>
    <div class="filters">
        <p>selected categories (all by default): {{ selectedCategories }}</p>
        <p>selected filters (none by default): {{ selectedFilters }}</p>
        <h3>catégories: </h3>
        <ul class="filtersList">
            <li v-for="category in categories" class="filter" :key="category.fields.nom.fr">
                <button @click="clickCategory" :name="category.fields.slug.fr">{{ category.fields.slug.fr }}</button>
                <!--TO SHOW IMAGE</p>-->
                <!--<p v-if="category.fields.image">{{ category.fields.image.fr.fields.file.fr.url }}</p>-->
            </li>
        </ul>
        <h3>autres filtres</h3>
        <ul class="filtersList">
            <li v-for="filter in filters" class="filter" :key="filter.fields.name.fr">
                <button @click="clickFilter" :name="filter.fields.slug.fr">{{ filter.fields.slug.fr }}</button>
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
      selectedFilters () {
        return this.$store.state.places['selectedFilters']
      },
      categories () {
        let entries = this.entries
        return entries.filter(function (categories) {
          return categories['sys']['contentType']['sys']['id'] === 'category'
        })
      },
      filters () {
        let entries = this.entries
        return entries.filter(function (filters) {
          return filters['sys']['contentType']['sys']['id'] === 'filters'
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
      clickCategory (event) {
        const category = event.target.name
        this.$store.dispatch('places/toggleCategory', { category })
      },
      clickFilter (event) {
        const filter = event.target.name
        this.$store.dispatch('places/toggleFilter', { filter })
      }
    },
    mounted () {
      // console.log('this.entries', this.entries)
    }
  }
</script>
<style>
button{
    background: lightgrey;
    padding:.5rem 1rem;
}
    .filter{
        display:inline-block;
        margin:0.5rem;
    }
    .filter p{
        margin:0;
    }
</style>