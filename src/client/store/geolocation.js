export const state = () => ({
  userPosition: {}
})

export const getters = {
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
        locations.push({position: {lat: place.fields.location.fr.lat,
          lng: place.fields.location.fr.lon}})
      })
    } else {
      console.log("all placesN1 are displayed on the map")
      placesN1.forEach( function (place) {
        locations.push({position: {lat: place.fields.location.fr.lat,
          lng: place.fields.location.fr.lon}})
      })
    }
    return locations
  }
}

export const mutations = {
  SET_USER_POSITION (state, coordinates) {
    state.userPosition = coordinates
    console.log(state.userPosition)
  }
}

export const actions = {
  async setUserPosition ({ commit, state }, { userPosition }) {
    try {
      console.log(userPosition);
      commit('SET_USER_POSITION', userPosition )
    } catch (e) {
      console.log(e)
    }
  }
}
