'use strict'

const ServiceAgent = require('../index')

module.exports = function getAgent(options) {
  return options instanceof ServiceAgent
    ? options
    : new ServiceAgent(options)
}
