<template>
    <li :class="{ 'filter--selected' : isSelected }">
        <button @click="clickFilter" :name="filter.fields.slug.fr">
            <img v-if="filter.fields.image" :src="filter.fields.image.fr.fields.file.fr.url" class="filter__icon">
            {{ filter.fields.name.fr }}
        </button>
    </li>
</template>

<script>
  export default {
    props: ['filter'],
    computed: {
      selectedPlaces () {
        return this.$store.state.places['selectedPlaces']
      },
      selectedFilters () {
        return this.$store.state.places['selectedFilters']
      },
      isSelected () {
        if (this.selectedFilters.includes(this.filter.fields.slug.fr)) {
          console.log('contains category', this.filter.fields.slug.fr)
          return true
        } else {
          console.log('does not contain category', this.filter.fields.slug.fr)
          return false
        }
      }
    },
    methods: {
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

</style>