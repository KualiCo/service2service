'use strict'

const Promise = require('bluebird')
const Koa = require('koa')
const onerror = require('koa-onerror')
const supertest = require('supertest')
const ServiceAgent = require('../index')
const koaMiddleware = require('../koa')

function createApp(agentOpts, verOpts, mw) {
  const app = new Koa()
  onerror(app)
  app.use(koaMiddleware(agentOpts, verOpts))
  app.use(mw)
  return supertest(app.callback())
}

describe('service2service/koa', () => {

  it('verifies tokens', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent(options)
    const request = createApp(options, null, function *(next) {
      this.body = 'success'
      yield next
    })
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .expect('success')
      })
  })

  it('fails if expired', () => {
    const options = { secret: 'foo', expire: 1 }
    const agent = new ServiceAgent(options)
    const request = createApp(options, null, function *(next) {
      this.body = 'should not have been successful'
      yield next
    })
    return agent.generate()
      .tap(() => Promise.delay(1001))
      .then((token) => {
        return request
          .get('/')
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${token}`)
          .expect(401, { error: 'jwt expired' })
      })
  })

  it('fails if secret differs', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent({ secret: 'bar' })
    const request = createApp(options, null, function *(next) {
      this.throw('should not have been successful')
      yield next
    })
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect(401, { error: 'invalid signature' })
      })
  })

  it('fails if header isn\'t provided', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent(options)
    const request = createApp(options, null, function *(next) {
      this.throw('should not have been successful')
      yield next
    })
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('X-Service-Token2', token)
          .set('Accept', 'application/json')
          .expect(401, { error: 'jwt must be provided' })
      })
  })

  it('allows generator options', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent(options)
    const request = createApp(options, { audience: 'bar' }, function *(next) {
      this.body = 'success'
      yield next
    })
    return agent.generate({ audience: 'bar' })
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect('success')
      })
  })

  it('fails if options don\'t match', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent({ secret: 'foo' })
    const request = createApp(options, { audience: 'foo' }, function *(next) {
      this.throw('should not have been successful')
      yield next
    })
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .set('Accept', 'application/json')
          .expect(401, { error: 'jwt audience invalid. expected: foo' })
      })
  })

  it('should use existing agent', () => {
    const agent = new ServiceAgent({ secret: 'foo' })
    const request = createApp(agent, null, function *(next) {
      this.body = 'success'
      yield next
    })
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .expect('success')
      })
  })

})
