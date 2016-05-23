'use strict'

const getAgent = require('./lib/get-agent')

function serviceAgentExpress(agentOptions, verifyOptions) {
  const agent = getAgent(agentOptions)

  return (req, res, next) => {
    const token = req.get(agent.header)
    agent.verify(token, verifyOptions)
      .then(() => next()) // TODO decide on how to expose the payload
      .catch((err) => {
        next(Object.assign(err, {
          name: 'UnauthorizedError',
          statusCode: 401,
          status: 401
        }))
      })
  }
}

module.exports = serviceAgentExpress
