'use strict'

const Promise = require('bluebird')
const chai = require('chai')
const express = require('express')
const superagent = require('supertest-as-promised')
const ServiceAgent = require('../index')
const expressMiddleware = require('../express')

const expect = chai.expect

function createApp(agentOpts, verOpts, mw) {
  const app = express()
  app.use(expressMiddleware(agentOpts, verOpts))
  app.use(mw)
  return superagent(app)
}

describe('service2service/express', () => {

  it('verifies tokens', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent(options)
    const request = createApp(options, null, (req, res) => res.send('success'))
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
    const request = createApp(options, null, [
      (req, res) => res.send('should not have been successful'),
      (err, req, res, next) => {
        try {
          expect(err.name).to.be.equal('UnauthorizedError')
          expect(err.message).to.match(/jwt expired/)
          return res.send('success')
        } catch (ex) {
          return next(ex)
        }
      }
    ])
    return agent.generate()
      .tap(() => Promise.delay(1001))
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .expect('success')
      })
  })

  it('fails if secret differs', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent({ secret: 'bar' })
    const request = createApp(options, null, [
      (req, res) => res.send('should not have been successful'),
      (err, req, res, next) => {
        try {
          expect(err.name).to.be.equal('UnauthorizedError')
          expect(err.message).to.match(/invalid signature/)
          return res.send('success')
        } catch (ex) {
          return next(ex)
        }
      }
    ])
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .expect('success')
      })
  })

  it('fails if header isn\'t provided', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent(options)
    const request = createApp(options, null, [
      (req, res) => res.send('should not have been successful'),
      (err, req, res, next) => {
        try {
          expect(err.name).to.be.equal('UnauthorizedError')
          expect(err.message).to.match(/jwt must be provided/)
          return res.send('success')
        } catch (ex) {
          return next(ex)
        }
      }
    ])
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('X-Service-Token2', token)
          .expect('success')
      })
  })

  it('allows generator options', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent(options)
    const request = createApp(options, { audience: 'bar' }, (req, res) => {
      res.send('success')
    })
    return agent.generate({ audience: 'bar' })
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .expect('success')
      })
  })

  it('fails if options don\'t match', () => {
    const options = { secret: 'foo' }
    const agent = new ServiceAgent({ secret: 'foo' })
    const request = createApp(options, { audience: 'foo' }, [
      (req, res) => res.send('should not have been successful'),
      (err, req, res, next) => {
        try {
          expect(err.name).to.be.equal('UnauthorizedError')
          expect(err.message).to.match(/jwt audience invalid/)
          return res.send('success')
        } catch (ex) {
          return next(ex)
        }
      }
    ])
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .expect('success')
      })
  })

  it('should use existing agent', () => {
    const agent = new ServiceAgent({ secret: 'foo' })
    const request = createApp(agent, null, (req, res) => res.send('success'))
    return agent.generate()
      .then((token) => {
        return request
          .get('/')
          .set('Authorization', `Bearer ${token}`)
          .expect('success')
      })
  })

})
