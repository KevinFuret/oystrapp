<template>
    <li :class="{ 'filter--selected' : isSelected }">
        <button @click="clickCategory" :name="category.fields.slug.fr">
            <img svg-inline v-if="category.fields.image" :src="category.fields.image.fr.fields.file.fr.url" class="filter__icon">
            {{ category.fields.nom.fr }}

        </button>
    </li>
</template>

<script>
  export default {
    props: ['category'],
    computed: {
      selectedPlaces () {
        return this.$store.state.places['selectedPlaces']
      },
      selectedCategories () {
        return this.$store.state.places['selectedCategories']
      },
      selectedFilters () {
        return this.$store.state.places['selectedFilters']
      },
      isSelected () {
        return !!this.selectedCategories.includes(this.category.fields.slug.fr)
      }
    },
    methods: {
      clickCategory (event) {
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