const contentful = require('contentful')
// import * as contentful from 'contentful'
// use default environment config for convenience
// these will be set via `env` property in nuxt.config.js

// const config = {
//   space: process.env.CTF_SPACE_ID,
//   accessToken: process.env.CTF_CDA_ACCESS_TOKEN
// }
//
// // export `createClient` to use it in page components
// module.exports = {
//   createClient () {
//     return contentful.createClient(config)
//   }
// }

const defaultConfig = {
  CTF_SPACE_ID: process.env.CTF_SPACE_ID,
  CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN
}

module.exports = {
  createClient (config = defaultConfig) {
    return contentful.createClient({
      space: config.CTF_SPACE_ID,
      accessToken: config.CTF_CDA_ACCESS_TOKEN
    })
  }
}
