'use strict'

const Promise = require('bluebird')
const request = require('request-promise')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const tryFallbacks = require('./lib/try-fallbacks')
const Housekeeper = require('./lib/housekeeper')

Promise.promisifyAll(jwt)

const SECONDS_TO_MILLISECONDS = 1000
const EXPIRE_SAFETY_MULTIPLIER = 1.5
const usedTokens = new Housekeeper({
  errorMessage: 'Token has already been used'
})
const getSecrets = Symbol('getSecrets')

class ServiceAgent {

  constructor(options) {
    options = Object.assign({}, {
      secret: null,
      expire: 60,
      header: 'Authorization',
      tokenPrefix: 'Bearer '
    }, options)

    if (!options.secret) {
      throw new ReferenceError('options.secret is required')
    }

    if (typeof options.secret !== 'function') {
      let val = options.secret
      val = Array.isArray(val) ? val : [val]
      options.secret = () => val
    }

    this[getSecrets] = Promise.method(options.secret)
    this.expire = options.expire
    this.header = options.header
    this.tokenPrefix = options.tokenPrefix
  }

  generate(options, payload) {
    options = Object.assign({
      expiresIn: this.expire
    }, options)

    payload = Object.assign({}, payload, {
      uuid: uuid.v4()
    })

    return this[getSecrets]().then((secrets) => {
      return jwt.signAsync(payload, secrets[0], options)
    })
  }

  verify(token, options) {
    const prefixRegex = new RegExp(`^${this.tokenPrefix}`)
    token = token && token.replace(prefixRegex, '')
    return this[getSecrets]()
      .then((secrets) => {
        return tryFallbacks(secrets, (secret) => {
          return jwt.verifyAsync(token, secret, options)
        }, jwt.JsonWebTokenError)
      })
      .then((payload) => {
        const expireMs = payload.exp * SECONDS_TO_MILLISECONDS - Date.now()
        usedTokens.add(payload.uuid, expireMs * EXPIRE_SAFETY_MULTIPLIER)
        return payload
      })
  }

  request(reqOptions, genOptions, payload) {
    reqOptions = Object.assign({
      headers: {}
    }, reqOptions)

    return this.generate(genOptions, payload).then((token) => {
      reqOptions.headers = Object.assign({
        [this.header]: this.tokenPrefix + token
      }, reqOptions.headers)
      return request(reqOptions)
    })
  }

}

module.exports = ServiceAgent
