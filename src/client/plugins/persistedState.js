import createPersistedState from 'vuex-persistedstate'
import Cookies from 'js-cookie'

// export default ({store, isHMR}) => {
//   if (isHMR) return
//
//   window.onNuxtReady(() => {
//     createPersistedState({
//       key: 'oystrPlaces',
//       // add path that we want to be persisted
//       // here only entries are stored
//       paths: ['places.entries', 'places.assets']
//       // storage: {
//       //   getState: (key) => Cookies.getJSON(key),
//       //   setState: (key, state) => Cookies.set(key, state, { expires: 1, secure: false }),
//         // removeItem: key => Cookies.remove(key)
//       // }
//     })(store)
//   })
//
// }
//

export default ({store}) => {
  createPersistedState({
      key: 'oystrPlaces',
      paths: ['places.entries', 'places.assets']
  })(store)
}
