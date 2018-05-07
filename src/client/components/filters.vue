<template>
    <div class="filters">
        <div class="help">
            <p>selected categories (all by default): {{ selectedCategories }}</p>
            <p>selected filters (none by default): {{ selectedFilters }}</p>
        </div>
        <div class="filter-group">
            <h3 class="filter-group__header">Mes catégories </h3>
            <ul class="filters-list">
                <li v-for="category in categories" class="filter filter--big"
                    :key="category.fields.nom.fr" :name="category.fields.slug.fr">
                    <button @click="clickCategory" :name="category.fields.slug.fr">
                        <img v-if="category.fields.image" :src="category.fields.image.fr.fields.file.fr.url" class="filter__icon">
                        {{ category.fields.nom.fr }}
                    </button>
                </li>
            </ul>
        </div>
        <div class="filter-group">
            <h3 class="filter-group__header">Autres filtres</h3>
            <ul class="filters-list">
                <li v-for="filter in filters" class="filter"
                    :key="filter.fields.name.fr"
                    :name="filter.fields.slug.fr">
                    <button @click="clickFilter" :name="filter.fields.slug.fr">
                        <img v-if="filter.fields.image" :src="filter.fields.image.fr.fields.file.fr.url" class="filter__icon">
                        {{ filter.fields.name.fr }}
                    </button>
                </li>
            </ul>
        </div>
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

.filter-group{
    padding:0.5rem;
}
.filter-group__header{
    margin-left:0.5rem;
    margin-bottom: 0.2rem;
}
.filters-list{
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 50% 50%;
}
.filter{
    display:inline-block;
    margin:0.5rem;
    background: white;
}
.filter button{
    background: white;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    padding:1rem;
    width: 100%;
    display: flex;
    align-items: center;
    font-weight:bold;
    color: #4a4a4a;
    text-transform: capitalize;
}

.filter--big button{
    flex-direction: column;
}

.filter--big .filter__icon{
    margin-right:0;
}
.filter__icon{
    height:1.375rem;
    max-width: 1.375rem;
    margin-right:1rem;
}
.filter p{
    margin:0;
}
</style>