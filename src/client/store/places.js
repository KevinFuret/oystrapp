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
  selectedCategories: [],
  selectedFilters: []
})

export const getters = {
  getEntries (state) {
    return state.entries
  },
  getSelections (state) {
    return state.entries.filter(function (entry) {
      return entry['sys']['contentType']['sys']['id'] === 'selection'
    })
  },
  getPlaces (state) {
    return state.entries.filter(function (place) {
      return place['sys']['contentType']['sys']['id'] === 'lieuN1' || place['sys']['contentType']['sys']['id'] === 'lieuN2'
    })
  },
  getPlacesN1 (state) {
    return state.entries.filter(function (placeN1) {
      return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    })
  },
  getPlacesN2 (state) {
    return state.entries.filter(function (placeN2) {
      return placeN2['sys']['contentType']['sys']['id'] === 'lieuN2'
    })
  },
  getSelectedPlaces (state) {
    return state.selectedPlaces
  },
  getSelectedCategories (state) {
    return state.selectedCategories
  },
  getSelectedFilters (state) {
    return state.selectedFilters
  },
  getPlaceBySlug (state, getters) {
    return slug => getters.getPlaces.filter(place => {
      return place.fields.slug.fr === slug
    })
  },
  getPlaceN1BySlug (state, getters) {
    return slug => getters.getPlacesN1.filter(place => {
      return place.fields.slug.fr === slug
    })
  },
  getPlaceN2BySlug (state, getters) {
    return slug => getters.getPlacesN2.filter(place => {
      return place.fields.slug.fr === slug
    })
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
  ADD_SELECTED_FILTER (state, filter) {
    state.selectedFilters.push(filter)
    console.log('pushed', filter)
  },
  REMOVE_SELECTED_FILTER (state, filterIndex) {
    state.selectedFilters.splice(filterIndex, 1)
    console.log('remove filter number ', filterIndex)
  },
  UPDATE_SELECTED_PLACES (state, newEntries) {
    state.selectedPlaces = newEntries
    console.log('updated selected places')
  },
  ADD_GOOGLE_INFOS (state, {index, infos}) {
    Vue.set(state.entries[index].fields, 'googleInfos', infos)
    // console.log('added google infos to store')
  },
  SET_IS_OPEN_NOW (state, {index, isOpenNow}) {
    Vue.set(state.entries[index].fields, 'isOpenNow', isOpenNow)
    console.log('set isOpenNow', state.entries[index].fields)
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
          // console.log('syncing with contentful ', response.entries)
          // console.log(response.assets)
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
  toggleFilter ({ commit, state, dispatch }, { filter }) {
    const index = state.selectedFilters.indexOf(filter)
    if (index > -1) {
      commit('REMOVE_SELECTED_FILTER', index)
    } else {
      commit('ADD_SELECTED_FILTER', filter)
    }
    dispatch('updateSelectedEntries')
  },
  updateSelectedEntries: function ({commit, dispatch, state}) {
    // query only N1 places
    let placesN1 = state.entries.filter(function (placeN1) {
      return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    })
    // find N1 places that have at least one of the selected categories
    let selectedEntries = placesN1.filter(function (placeN1) {
      let hasAtLeaseOneCategory = true
      let hasAllFilters = false
      const placeCategories = []
      const placeFilters = []
      /* placeN1.fields.filters.fr.forEach(function (filter) {
        if (state.selectedFilters.indexOf(filter.fields.slug.fr) < 0) console.log('filtre nest pas présent')
      }) */
      placeN1.fields.placeCategory.fr.forEach(function (cat) {
        placeCategories.push(cat.fields.slug.fr)
      })
      placeN1.fields.filters.fr.forEach(function (filter) {
        placeFilters.push(filter.fields.slug.fr)
      })
      if (state.selectedCategories.length > 0) {
        hasAtLeaseOneCategory = false
        placeCategories.forEach(function (cat) {
          if (state.selectedCategories.indexOf(cat) >= 0) hasAtLeaseOneCategory = true
        })
      }
      hasAllFilters = state.selectedFilters.every((val) => placeFilters.includes(val) || (!val || val.length === 0))
      return hasAllFilters && hasAtLeaseOneCategory
    })
    dispatch('sortPlacesByDistance', selectedEntries)
    // commit('UPDATE_SELECTED_PLACES', selectedEntries)
  },
  addAllPlacesAsSelected ({commit, dispatch, state}) {
    let placesN1 = state.entries.filter(function (placeN1) {
      return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    })
    dispatch('sortPlacesByDistance', placesN1)
  },
  getGoogleInfos ({state, commit, dispatch}, payload) {
    console.log('getting google infos in store')
    const placeID = payload.placeId
    const proxyurl = 'https://cors-anywhere.herokuapp.com/'
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeID + '&key=AIzaSyAbP1t4UE9cfSuNYsmOXkRaHLVMJQHV2rQ'
    fetch(proxyurl + url)
      .then(response => response.text())
      // .then(contents => console.log('contents', contents))
      .then(contents => dispatch('updateGoogleInfos', {placeId: placeID, infos: JSON.parse(contents).result}))
      .catch(() => console.log('Can’t access ' + url + ' response. Blocked by browser?'))
  },
  updateGoogleInfos ({ state, commit, dispatch }, payload) {
    // let placesN1 = state.entries.filter(function (placeN1) {
    //   return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
    // })
    const infos = payload.infos
    // placesN1.forEach(function (place, index) {
    state.entries.forEach(function (place, index) {
      if (place.fields.googlePlaceId !== undefined) {
        if (payload.placeId === place.fields.googlePlaceId.fr) {
          commit('ADD_GOOGLE_INFOS', {index, infos})
          dispatch('recalculateIsOpenNow', place.fields.slug.fr)
        }
      }
    })
  },
  sortPlacesByDistance ({commit, rootState}, placesToSort) {
    console.log('sorting...')
    let places = placesToSort
    if (places === null || places === undefined) {
      places = rootState.places.entries.filter(function (placeN1) {
        return placeN1['sys']['contentType']['sys']['id'] === 'lieuN1'
      })
    }
    console.log('places to sort', places)
    let allDistanceCalculated = places.every(hasDistance)
    if (allDistanceCalculated) {
      places.sort(function (a, b) {
        return a.fields.distance.rows[0].elements[0].distance.value - b.fields.distance.rows[0].elements[0].distance.value
      })
      console.log('new selected places order', places)
      commit('UPDATE_SELECTED_PLACES', places)
    }
  },
  recalculateIsOpenNow ({state, commit, getters}, placeSlug) {
    console.log('recalculating..', placeSlug)
    let place = getters.getPlaceBySlug(placeSlug)[0].fields
    let isOpenNow = null
    if (place.googleInfos && place.googleInfos.opening_hours) {
      const periods = place.googleInfos.opening_hours.periods
      let d = new Date()
      let day = d.getDay()
      // let day = 2 // mardi
      let hour = d.getHours()
      // precede hour and minute by a zero to match with google syntax, if number is below 10
      if (hour < 10) {
        hour = '0' + hour
      }
      let minutes = d.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      let time = '' + hour + minutes
      isOpenNow = false
      // console.log('day', day)
      // console.log('time', time)
      // find only the day corresponsing to today
      let dayPeriods = periods.filter(x => x.open.day === day)
      if (dayPeriods.length === 0) console.log('no hours specified')
      else {
        // forEach period in googleInfos of the right day, check if the current time is between opening and closing hour
        dayPeriods.forEach(function(period) {
          if (time > period.open.time && time < period.close.time) isOpenNow = true
        })
      }
      console.log('day', day)
      console.log('time', time)
      console.log('isOpenNow', isOpenNow)
    } else {
      console.log('no google infos or opening hours')
    }
    const placeId = place.googlePlaceId
    // find the right place in the state tree and update isOpenNow
    state.entries.forEach(function (statePlace, index) {
      if (statePlace.fields.googlePlaceId !== undefined) {
        if (placeId.fr === statePlace.fields.googlePlaceId.fr) {
          commit('SET_IS_OPEN_NOW', {index, isOpenNow})
        }
      }
    })
  }
}

function hasDistance (place) {
  console.log('place name', place.fields.name.fr)
  console.log('place distance', place.fields.distance.rows[0].elements[0].distance.value)
  return place.fields !== undefined
}
