import { createClient } from '~/plugins/contentful'
import axios from '~/plugins/axios'

// initialize contentful client
const client = createClient()

export const state = () => ({
  entries: [],
  assets: [],
  token: '',
  selectedPlaces: [],
  selectedCategories: []
})

export const mutations = {
  FETCH_ALL_PLACES_REQUEST (state) {
    console.log('Fetching all places...')
  },
  SET_ALL_ENTRIES_SUCCESS (state, data) {
    state.entries = data
    console.log('Set all places success !')
  },
  SET_ALL_ASSETS_SUCCESS (state, data) {
    state.assets = data
    console.log('Set all assets success !')
  },
  FETCH_PLACE_ERROR (state, error) {
    console.log(error);
  },
  UPDATE_SYNC (state) {
    console.log("Sync content")
  },
  SET_TOKEN (state, token) {
    state.token = token
    console.log('Set token success !')
  },
  ADD_SELECTED_CATEGORY (state, category) {
    state.selectedCategories.push(category)
    console.log('pushed', category)
  },
  REMOVE_SELECTED_CATEGORY (state, categoryIndex) {
    state.selectedCategories.splice(categoryIndex, 1)
    console.log('remove category number ', categoryIndex)
  },
  UPDATE_SELECTED_PLACES (state, newEntries) {
    state.selectedPlaces = newEntries
    console.log('updated selected places')
  },
  ALL_ALL_TO_SELECTED_PLACES (state, places) {
    state.selectedPlaces = places
    console.log('added all places to selected')
  }
}

export const actions = {
  async fetchAllPlaces ({ commit, dispatch }) {
      try {
        commit('FETCH_ALL_PLACES_REQUEST')
        // get entries from space contentful using Sync API
        await client.sync({ initial: true })
          .then((response) => {
            const responseObj = JSON.parse(response.stringifySafe())
            const entries = responseObj.entries
            const assets = responseObj.assets
            // let data = JSON.stringify(entries)
            let token = response.nextSyncToken
            commit('SET_ALL_ENTRIES_SUCCESS', entries)
            commit('SET_ALL_ASSETS_SUCCESS', assets)
            commit('SET_TOKEN', token)
            // enlever la ligne ci dessous quand on aura fait l'inscription
            dispatch('addAllPlacesAsSelected', entries)
          })
      } catch (e) {
        commit('FETCH_PLACE_ERROR', e)
      }
  },
  async updateContent ({ commit }, { savedToken }) {
    try {
      commit('UPDATE_SYNC')
      console.log(savedToken);
      // update store if changes have been made in contentful
      await client.sync({ nextSyncToken: savedToken })
        .then((response) => {
          console.log("Entries : " + response.entries)
          console.log("Assets : " + response.assets)
          commit('SET_TOKEN', response.nextSyncToken)
        })
    } catch (e) {
      commit('FETCH_PLACE_ERROR', e)
    }
  },
  toggleCategory ({ commit, state, dispatch }, { category }) {
    const index = state.selectedCategories.indexOf(category)
    if (index > -1) {
      commit('REMOVE_SELECTED_CATEGORY', index)
    } else {
      commit('ADD_SELECTED_CATEGORY', category)
    }
    dispatch('updateSelectedEntries')
  },
  updateSelectedEntries ({commit, state}) {
    // query only N1 places
    let placesN1 = state.entries.filter(function (placeN1) {
      return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    })
    // find N1 places that have at least one of the selected categories
    let selectedEntries = placesN1.filter(function (placeN1) {
      let isFiltered = false
      placeN1.fields.placeCategory.fr.forEach(function (cat) {
        if (state.selectedCategories.indexOf(cat.fields.slug.fr) >= 0) isFiltered = true
      })
      return isFiltered
    })
    commit('UPDATE_SELECTED_PLACES', selectedEntries)
  },
  addAllPlacesAsSelected ({commit}, { entries }) {
    let placesN1 = entries.filter(function (placeN1) {
      return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    })
    commit('ALL_ALL_TO_SELECTED_PLACES', placesN1)
  }
}
