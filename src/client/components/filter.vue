<template>
    <li class="filter--selected">
        <button @click="clickCategory" :name="category.fields.slug.fr">
            <img v-if="category.fields.image" :src="category.fields.image.fr.fields.file.fr.url" class="filter__icon">
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

    .filter--selected{
        border:1px solid #2E86DE;
    }

    .filter--selected button{
        color: #2E86DE;
    }
</style>