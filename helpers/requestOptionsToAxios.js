'use strict'

const axios = require('axios')

function requestOptionsToAxios(reqOptions) {
  if (reqOptions.uri && !reqOptions.url) {
    reqOptions.url = reqOptions.uri
    delete reqOptions.uri
  }

  if (typeof reqOptions.qs !== 'undefined' && typeof reqOptions.params === 'undefined') {
    reqOptions.params = reqOptions.qs
    delete reqOptions.qs
  }
  if (typeof reqOptions.body !== 'undefined' && typeof reqOptions.data === 'undefined') {
    reqOptions.data = reqOptions.body
    delete reqOptions.body
  }

  delete reqOptions.json
}


function executeAxiosRequest(reqOptions) {
  const resolveWithFullResponse = reqOptions.resolveWithFullResponse === true
  const simple = reqOptions.simple !== false
  if ('resolveWithFullResponse' in reqOptions) delete reqOptions.resolveWithFullResponse
  if ('simple' in reqOptions) delete reqOptions.simple

  requestOptionsToAxios(reqOptions)
  if (simple === false) {
    reqOptions.validateStatus = () => true
  }

  return axios(reqOptions)
    .then((response) => {
      if (resolveWithFullResponse) {
        return {
          statusCode: response.status,
          headers: response.headers,
          body: response.data
        }
      }
      return response.data
    })
    .catch((error) => {
      if (error.response) {
        const err = new Error(error.response.data || error.message)
        err.statusCode = error.response.status
        err.error = error.response.data
        err.response = error.response
        return Promise.reject(err)
      }
      return Promise.reject(error)
    })
}

module.exports = requestOptionsToAxios
module.exports.executeAxiosRequest = executeAxiosRequest
