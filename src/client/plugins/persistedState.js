import createPersistedState from 'vuex-persistedstate'
//
// export default ({store, isHMR, isClient}) => {
//   if (isHMR) return
//
//   window.onNuxtReady(() => {
//     createPersistedState({
//       key: 'oystrPlaces',
//       // add path that we want to be persisted
//       // here only entries are stored
//       paths: ['places.entries', 'places.assets']
//       // storage: {
//       //   getItem: (key) => Cookies.getJSON(key),
//       //   setItem: (key, state) => Cookies.set(key, state, { expires: 1}),
//       //   removeItem: key => Cookies.remove(key)
//       // }
//     })(store)
//   })
//
// }
//
export default ({store}) => {
  createPersistedState({
      // key: '',
      // paths: ['places.entries', 'places.assets']
  })(store)
}
