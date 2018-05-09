import Vue from 'vue'

export const state = () => ({
  userPosition: {} // default Nantes coordinates
})

export const getters = {
  getUserPosition (state) {
    return state.userPosition
  },
  getLocations (context, state, rootState, rootGetters) {
    // return rootGetters['places/getPlacesN1']
    // return rootState.places.selectedPlaces
    let locations = []
    let selectedPlaces = rootGetters['places/getSelectedPlaces']
    let selectedCategories = rootGetters['places/getSelectedCategories']
    let selectedFilters = rootGetters['places/getSelectedFilters']
    let placesN1 = rootGetters['places/getPlacesN1']
    // if no filters were selected
    // else all filters are selected by default
    if (selectedCategories.length !== 0 || selectedFilters.length !== 0) {
      selectedPlaces.forEach( function(place) {
        console.log("I've selected some places")
        locations.push({id: place.sys.id, position: {lat: place.fields.location.fr.lat,
          lng: place.fields.location.fr.lon}})
      })
    } else {
      console.log("all placesN1 are displayed on the map")
      placesN1.forEach( function (place) {
        locations.push({id: place.sys.id, position: {lat: place.fields.location.fr.lat,
          lng: place.fields.location.fr.lon}})
      })
    }
    return locations
  }
}

export const mutations = {
  SET_USER_POSITION (state, coordinates) {
    state.userPosition = coordinates
  },
  UPDATE_USER_POSITION (state, position) {
    state.userPosition = {lat: position.coords.latitude, lng : position.coords.longitude}
  },
  SET_DISTANCE (state, {index, datas, entries}) {
    Vue.set(entries[index].fields, 'distance', datas)
  }
}

export const actions = {
  setUserPosition ({ commit, state }, { userPosition }) {
    try {
      commit('SET_USER_POSITION', userPosition )
    } catch (e) {
      console.log(e)
    }
  },
  watchUserPosition ({commit, state, dispatch}) {
    navigator.geolocation.watchPosition( function (position) {
      // console.log("position", position.coords.latitude);
      commit('UPDATE_USER_POSITION', position)
    })
  },
  calculateDistance ({ commit, state, dispatch }, place) {
    let placeId = place.googlePlaceId.fr
    let userPosition = state.userPosition
    let origins = userPosition.lat + ',' + userPosition.lng
    // mode can be : driving, bicycling, transit
    let mode = "walking"
    const proxyurl = 'https://cors-anywhere.herokuapp.com/'
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origins +
                  '&destinations=place_id:' + placeId +
                  '&key=AIzaSyD2r_aDga1pPaBBdF5bfSn2ef7YVdYsIIQ' + '&mode=' + mode

    fetch( proxyurl + url )
      .then(response => response.text())
      .then(contents => {
        const payload = {id: placeId, datas: JSON.parse(contents)}
        dispatch('updateDistance', payload)
      })
      .catch((e) => console.log(e))

  },
  updateDistance ({ state, commit, rootState }, payload ) {
    const datas = payload.datas
    let entries = rootState.places.entries
    entries.forEach( function (el, index) {
      if ( el.fields.googlePlaceId !== undefined ) {
        if ( payload.id === el.fields.googlePlaceId.fr ) {
          commit('SET_DISTANCE', {index, datas, entries})
        }
      }
    })
  }
}
