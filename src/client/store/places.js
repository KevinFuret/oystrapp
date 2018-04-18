import { createClient } from '~/plugins/contentful'
// import myPlugin from '~/plugins/persistedState'

const client = createClient()

export const state = () => ({
  lieux: [],
  token: ''
})

export const mutations = {
  FETCH_ALL_PLACES_REQUEST (state) {
    console.log('Fetching all places...')
  },
  FETCH_ALL_PLACES_SUCCESS (state, places) {
    state.lieux = places
    console.log('Fetch all places success !')
  },
  FETCH_PLACE_ERROR (state, error) {
    console.log(error.response.data);
  },
  SET_TOKEN (state, token) {
    state.token = token
    console.log('Fetch token success !')
  }
}

export const actions = {
  async fetchAllPlaces ({ commit }) {
      try {
        commit('FETCH_ALL_PLACES_REQUEST')
        client.sync({ initial: true })
          .then((response) => {
            const responseObj = JSON.parse(response.stringifySafe())
            const entries = responseObj.entries
            let data = JSON.stringify(entries)
            let token = response.nextSyncToken
            console.log(token)
            commit('FETCH_ALL_PLACES_SUCCESS', data)
            commit('SET_TOKEN', token)
          })
      } catch (e) {
        commit('FETCH_PLACE_ERROR', e)
      }
  }
}
