<template>
  <div>
    <vue-simple-suggest
      v-model="query"
      :list="getList"
      placeholder="Essayer 'Planétarium'"
      type="search"
      ref="suggestComponent"
      mode="input"
      :filter-by-query="false"
      display-attribute="text"
      >

      <!-- <div slot="suggestion-item" slot-scope="scope">
          <div class="text">
            <span v-html="boldenSuggestion(scope)"></span>
          </div>
      </div> -->

    </vue-simple-suggest>

    <p>Chosen element: {{ query }}</p>

  </div>
</template>

<script>
import VueSimpleSuggest from 'vue-simple-suggest'
import 'vue-simple-suggest/dist/styles.css' // Optional CSS

  export default {
    components: {
      VueSimpleSuggest
    },
    data () {
      return {
        query: '',
        loading: false
      }
    },
    mounted () {
      console.log(VueSimpleSuggest);
    },
    methods: {
      boldenSuggestion(scope) {
        if (!scope) return '';

        const { suggestion, query } = scope;

        let result = this.$refs.suggestComponent.displayProperty(suggestion);

        if (!query) return result;

        const texts = query.split(/[\s-_/\\|\.]/gm).filter(t => !!t) || [''];
        return result.replace(new RegExp('(.*?)(' + texts.join('|') + ')(.*?)','gi'), '$1<b>$2</b>$3');
      },
      getList() {
        let jsonList = this.$store.getters['places/getPlacesN1']
        let arrayList = []
        jsonList.forEach( el => {
          arrayList.push(
            // {
            // id: el.fields.googlePlaceId.fr,
            // name: el.fields.name.fr
            el.fields.name.fr
            // }
          )
        })
        return arrayList
      }
    }
  }
</script>
