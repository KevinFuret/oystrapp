<template lang="html">
  <!-- <div> -->
    <!-- <h1>Vue-autosuggest 🔮</h1> -->
    <!-- <div style="padding-top:10px; margin-bottom: 10px;"><span v-if="selected">You have selected '{{JSON.stringify(selected,null,2)}}'</span></div> -->
        <vue-autosuggest
            :suggestions="filteredOptions"
            @focus="focusMe"
            @click="clickHandler"
            :onSelected="onSelected"
            :renderSuggestion="renderSuggestion"
            :getSuggestionValue="getSuggestionValue"
            :inputProps="{id:'autosuggest__input', onInputChange: this.onInputChange, placeholder:'Essayer Planétarium'}"/>
  <!-- </div> -->
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest'

export default {
  components: {
  VueAutosuggest
},
data() {
  return {
    selected: "",
    filteredOptions: []
  };
},
computed: {
  suggestions() {
    let datas = this.$store.getters['places/getPlacesN1']
    let array = []
    array.push(datas)
    return array
  }
},
methods: {
  onInputChange(text, oldText) {
    if (text === null) {
      /* Maybe the text is null but you wanna do
      * something else, but don't filter by null.
      */
      return;
    }

    // Full customizability over filtering
    const filteredData = this.suggestions[0].filter(option => {
      return option.fields.name.fr.toLowerCase().indexOf(text.toLowerCase()) > -1;
    });

    // Store data in one property, and filtered in another
    this.filteredOptions = [{ data: filteredData }];
  },
  clickHandler(item){
    // items are selected by default on click, but you can add some more behavior here!
  },
  onSelected(item) {
    this.selected = item.item.fields;
  },
  renderSuggestion(suggestion) {
    /* You will need babel-plugin-transform-vue-jsx for this kind of full customizable
     * rendering. If you don't use babel or the jsx transform, then you can use this
     * function to just `return suggestion['propertyName'];`
     */
    const character = suggestion.item;
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <span style={{ color: "navyblue" }}>{character.fields.name.fr}</span>
      </div>
    );
  },
  /**
   * This is what the <input/> value is set to when you are selecting a suggestion.
   */
  getSuggestionValue(suggestion) {
    return suggestion.item.fields.name.fr;
  },
  focusMe(e) {
    console.log(e)
  }
}
};
</script>

<style>
#autosuggest__input {
  outline: none;
  position: relative;
  display: block;
  border: 1px solid #c4c4c4;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

#autosuggest__input.autosuggest__input-open {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.autosuggest__results-container {
  position: relative;
  width: 100%;
}

.autosuggest__results {
  font-weight: 300;
  margin: 0;
  position: absolute;
  z-index: 10000001;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  background: white;
  padding: 0px;
  max-height: 400px;
  overflow-y: scroll;
}

.autosuggest__results ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.autosuggest__results .autosuggest__results_item {
  cursor: pointer;
  padding: 15px;
}

#autosuggest ul:nth-child(1) > .autosuggest__results_title {
  border-top: none;
}

.autosuggest__results .autosuggest__results_title {
  color: gray;
  font-size: 11px;
  margin-left: 0;
  padding: 15px 13px 5px;
  border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results
  .autosuggest__results_item.autosuggest__results_item-highlighted {
  background-color: #f6f6f6;
}
</style>
