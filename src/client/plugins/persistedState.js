import createPersistedState from 'vuex-persistedstate'

export default ({store, isHMR}) => {
  if (isHMR) return

  window.onNuxtReady(() => {
    createPersistedState({
      key: 'oystrPlaces',
      // add path that we want to be persisted
      paths: ['places', 'token']
    })(store)
  })
}
