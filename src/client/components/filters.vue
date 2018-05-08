<template>
    <div class="filters">
        <div class="filter-group">
            <h3 class="filter-group__header">Mes catégories </h3>
            <ul class="filters-list">
                <category-filter v-for="category in categories" class="filter filter--big"
                    :key="category.fields.nom.fr" :category="category">
                </category-filter>
            </ul>
        </div>
        <div class="filter-group">
            <h3 class="filter-group__header">Autres filtres</h3>
            <ul class="filters-list">
                <filter-filter v-for="filter in filters" class="filter"
                    :key="filter.fields.name.fr" :filter="filter">
                </filter-filter>
            </ul>
        </div>
    </div>
</template>

<script>
  import categoryFilter from './categoryFilter.vue'
  import filterFilter from './filterFilter.vue'
  export default {
    components: {
      'category-filter': categoryFilter,
      'filter-filter': filterFilter
    },
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
    mounted () {
      // console.log('this.entries', this.entries)
    }
  }
</script>
<style>
.filters{
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

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
    outline:none !important;
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

.filter--selected button{
    border:1px solid #2E86DE;
    color: #2E86DE;
}
.filter--selected .filter__icon {
    /* contraste au max - on passe en blanc - puis en sépia - on ajoute couleur au max - on change de hue*/
    filter: contrast(1000%) invert(100%) sepia(100%) saturate(1000000%) hue-rotate(178deg);
}
</style>