'use strict'

function handleAxiosRequest(reqOptions){
  if (reqOptions.uri && !reqOptions.url) {
    reqOptions.url = reqOptions.uri
    delete reqOptions.uri
  }

  if (typeof reqOptions.qs !== 'undefined'
      && typeof reqOptions.params === 'undefined') {
    reqOptions.params = reqOptions.qs
    delete reqOptions.qs
  }
  if (typeof reqOptions.body !== 'undefined'
      && typeof reqOptions.data === 'undefined') {
    reqOptions.data = reqOptions.body
    delete reqOptions.body
  }

  delete reqOptions.json
}

module.exports = handleAxiosRequest
