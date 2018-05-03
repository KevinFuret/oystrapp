import { createClient } from '~/plugins/contentful'
import Vue from 'vue'
// import fetch from 'node-fetch'

// initialize contentful client
const client = createClient()

export const state = () => ({
  entries: [],
  assets: [],
  token: '',
  selectedPlaces: [],
  selectedCategories: []
})

export const getters = {
  getEntries (state) {
    return state.entries
  },
  getPlacesN1 (state) {
    return state.entries.filter(function (placeN1) {
      return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    })
  },
  getSelectedPlaces (state) {
    return state.selectedPlaces
  }
}

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
  },
  ADD_GOOGLE_INFOS (state, {index, infos}) {
    Vue.set(state.entries[index].fields, 'googleInfos', infos)
    // console.log('added google infos to store')
  }
}

export const actions = {
  async fetchAllPlaces ({ commit, state, dispatch }) {
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
            dispatch('addAllPlacesAsSelected')
            // dispatch('getGoogleInfos')
          })
      } catch (e) {
        commit('FETCH_PLACE_ERROR', e)
      }
  },
  async updateContent ({ commit }, { savedToken }) {
    try {
      // update store if changes have been made in contentful
      let token = savedToken
      await client.sync({ nextSyncToken: token })
        .then((response) => {
          console.log('syncing with contentful ', response.entries)
          console.log(response.assets)
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
  addAllPlacesAsSelected ({commit, state} ) {
    let placesN1 = state.entries.filter(function (placeN1) {
      return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    })
    commit('ALL_ALL_TO_SELECTED_PLACES', placesN1)
  },
  getGoogleInfos ({state}) {
    // DEPRECATED FUNCTION //
    // get only places of type lieuN1
    let placesN1 = state.entries.filter(function (placeN1) {
      return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    })
    // for each lieuN1 type of place, get google infos via google places api
    placesN1.forEach(function (element) {
      // check if googleInfos is set or not, query if not set, log it if set
      if (element.fields.googleInfos === undefined) {
        const proxyurl = 'https://cors-anywhere.herokuapp.com/'
        const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + element.fields.googlePlaceId.fr + '&key=AIzaSyAbP1t4UE9cfSuNYsmOXkRaHLVMJQHV2rQ'
        fetch(proxyurl + url, )
          .then(response => response.text())
          .then(contents => console.log('contents', contents))
          // .then(contents => element.fields.googleInfos = JSON.parse(contents).result)
          // .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'))
      } else { console.log(element.fields.googleInfos) }
    })
  },
  updateGoogleInfos ({ state, commit }, payload) {
    // let placesN1 = state.entries.filter(function (placeN1) {
    //   return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    // })
    const infos = payload.infos
    // placesN1.forEach(function (place, index) {
    state.entries.forEach(function (place, index) {
      if (place.fields.googlePlaceId !== undefined) {
        if (payload.placeId === place.fields.googlePlaceId.fr) {
          commit('ADD_GOOGLE_INFOS', {index, infos})
        }
      }
    })
  }
}
