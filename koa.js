'use strict'

const getAgent = require('./lib/get-agent')

function serviceAgentKoa(agentOptions, verifyOptions) {
  const agent = getAgent(agentOptions)

  return function *(next) {
    const token = this.get(agent.header)
    yield agent.verify(token, verifyOptions).catch((err) => { // TODO decide on how to expose the payload
      this.throw(err.message, 401, {
        name: 'UnauthorizedError'
      })
    })
    yield next
  }
}

module.exports = serviceAgentKoa
