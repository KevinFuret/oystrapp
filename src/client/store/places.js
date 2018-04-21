import { createClient } from '~/plugins/contentful'
import axios from '~/plugins/axios'

// initialize contentful client
const client = createClient()

export const state = () => ({
  entries: [],
  token: ''
})

export const mutations = {
  FETCH_ALL_PLACES_REQUEST (state) {
    console.log('Fetching all places...')
  },
  SET_ALL_ENTRIES_SUCCESS (state, data) {
    state.entries = data
    console.log('Set all places success !')
  },
  FETCH_PLACE_ERROR (state, error) {
    console.log(error.response.data);
  },
  SET_TOKEN (state, token) {
    state.token = token
    console.log('Set token success !')
  }
}

export const actions = {
  async fetchAllPlaces ({ commit }) {
      try {
        commit('FETCH_ALL_PLACES_REQUEST')
        await client.sync({ initial: true })
          .then((response) => {
            const responseObj = JSON.parse(response.stringifySafe())
            const entries = responseObj.entries
            // let data = JSON.stringify(entries)
            let token = response.nextSyncToken
            commit('SET_ALL_ENTRIES_SUCCESS', entries)
            commit('SET_TOKEN', token)
          })
      } catch (e) {
        commit('FETCH_PLACE_ERROR', e)
      }
  },
  async updateContent ({ commit }, { savedToken } ) {
    try {
      await client.sync({ nextSyncToken: savedToken })
        .then((response) => {
          console.log(response.entries)
          console.log(response.assets)
          commit('SET_TOKEN', response.nextSyncToken)
        })
    } catch (e) {
      console.log(e)
      // commit('FETCH_PLACE_ERROR', e)
    }
  }
}
