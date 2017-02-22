# service2service

A node module to make service to service communication secure and easy.

Sometimes you have a service that needs to talk to another service, but you
don't have the context of a user with which to authenticate with. This module
aims to make authentication easy, given that both of your services share a
secret.

# Installation

```
npm install --save service2service
```

# Usage

```js
import ServiceAgent from 'service2service'

const agent = new ServiceAgent({
  secret: 'super secret',
  expire: 60, // 1 minute
  header: 'Authorization',
  tokenPrefix: 'Bearer '
})

agent.generate()
  .then((token) => {
    // token that is only valid for 1 minute
    return agent.verify(token)
  })
  .then((payload) => {
    // token is verified, error gets thrown if not verified
  })

// This is an instance of request promise that will automatically add the
// header to every request. This takes care of the `generate` functionality for
// you.

// Note that this is just a wrapper around request promise because we have to
// handle the case of asynchronous secret getting. If you wish to use the raw
// request object, implement the `generate()` method into your workflow
agent
  .request({
    uri: 'http://www.example.com',
    method: 'POST'
    body: {
      some: 'payload'
    },
    resolveWithFullResponse: true,
    json: true
  })
  .then(({ body, statusCode }) => {
    // Successful request!
  })
```

# Consuming a ServiceAgent token

The middleware described below take care of the `verify` functionality.

## Express

```js
import express from 'express'
import service2service from 'service2service/express'

const app = express()

app.get('/only-services-allowed', [
  service2service({
    secret: 'super secret',
    header: 'X-Service-Token'
  }),
  (req, res, next) => {
    // If we made it to this middleware, we can assume that the request came
    // across with a valid token
    res.send('success')
  }
])
```

## Koa

```js
import koa from 'koa'
import service2service from 'service2service/koa'

const app = koa()

app.use(service2service({
  secret: 'super secret',
  header: 'X-Service-Token'
}))

app.use(function *() {
  // If we made it to this middleware, we can assume that the request came
  // across with a valid token
  this.body = 'success'
})
```

# API Documentation

## `new ServiceAgent(options)`

Returns a new "secret service agent"

- `options.secret` {(string|string[]|Function)} - The shared secret that both
  the client and the server should know about. If a function is passed,
  it can return the value of the secret, or return a promise that resolves to
  the secret. This should work if you pass in an `async` function. In the
  `.generate` function, it will use the first secret in the array if an array
  of secrets is passed. `.verify` will try all of them in turn until one passes
  validation

  ```js
  const agent = new ServiceAgent({
    secret: [
      'super secret',
      'super secret2'
    ],
    expire: 60, // 1 minute
    header: 'Authorization'
  })
  ```

  Default: `null` - Note that this is a required option. You must have at least
  1 secret or this will throw an error on verification. This is a breaking
  change as of version 2.x.

- `options.expire` - {number} - The number of seconds that the token is valid
  for. This should be something low, like 1 minute (`60`).

  Default: `60`

- `options.header` {string} - The header that will contain the token.

  Default `Authorization`

- `options.tokenPrefix` {string} - The prefix to prepend to the token when the
  token is sent in a request. This will also be used to strip out the prefix
  upon verification. If a token is sent without a prefix, it will still verify.

  Default: `Bearer ` (yes, that's a space at the end)

## `agent.generate([options [, payload]])`

Returns a promise that resolves to a generated token, or throws if your secret
function generator throws an error.

Note: You shouldn't need to use this directly because `agent.request` takes care
of this for you, but you may need it if you would like to implement it into your
own request library.

You can pass options in here that get passed into [`jwt.sign`][jwt.sign] as the
options. Below are ones you should consider using:

- `options.audience` {string} - Who the token is intended for
- `options.subject` {string} - A description of the action to take place
- `options.issuer` {string} - Who is issued the token
- `payload` {object} - The payload of the token

Those options may be used on the consuming end to verify a token.

## `agent.verify(token[, options])`

Returns a promise that resolves to the payload of the token. The `secret`
parameter is optional and is only used if you want to override the agent's
'secret' option. The options are the same options in [`jwt.sign`][jwt.sign]

## `agent.request(reqOptions[, genOptions [, payload])`

This is wrapper around [`request-promise`][request]. It accepts all the same
options. Note that this is just a wrapper function and does not provide the
sugar methods like `request.post()` or `request.get()`.

- `reqOptions` {Object} - The options you pass into `request`. You can see all
  of the available options [`here`][request]
- `genOptions` {Object} - The options that get passed into `agent.generate()`
- `payload` {Object} - The payload that gets passed into `agent.generate()`

## middleware

The api for express middleware and koa middleware is the same. It accepts all
of the same options as the `ServiceAgent` constructor, or you may pass in a
`ServiceAgent` instance.

```js
import ServiceAgent from 'service2service'
import expressMiddleware from 'service2service/express'
import koaMiddleware from 'service2service/koa'

const agent = new ServiceAgent({
  secret: 'super secret',
  expire: 60000,
  header: 'X-Service-Token'
})

expressMiddleware(agent)
koaMiddleware(agent)
```

`middleware(agentOptions[, verifyOptions])`

- `agentOptions` {Object} - The options passed into a service agent constructor
- `verifyOptions` {Object} - The options passed into
  `agent.verify(token, options)`

[jwt.sign]: https://www.npmjs.com/package/jsonwebtoken#user-content-jwtsignpayload-secretorprivatekey-options-callback
[request]: https://www.npmjs.com/package/request-promise
