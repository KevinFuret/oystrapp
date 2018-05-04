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
    let placesN1 = rootGetters['places/getPlacesN1']
    // if no filters were selected
    // else all filters are selected by default
    if (selectedPlaces.length !== 0) {
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
  },
  getMeters (context, rootState, state) {
    // TODO: display value from entries.distance
    // if value > 1000 -> user km units. Else use meters
  },
  getDuration () {
    // TODO : display duration from entries.distance
    // if duration > 1hour uses hours. Else use minutes
  }
}

export const mutations = {
  SET_USER_POSITION (state, coordinates) {
    state.userPosition = coordinates
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
