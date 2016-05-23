'use strict'
/* eslint-disable max-statements */

const chai = require('chai')
const Promise = require('bluebird')
const jwt = require('jsonwebtoken')
const nock = require('nock')
const ServiceAgent = require('../index')

const expect = chai.expect

describe('service2service', () => {

  describe('constructor', () => {

    it('fails if secret isn\'t passed', () => {
      expect(() => new ServiceAgent())
        .to.throw(ReferenceError, 'options.secret is required')
    })

    it('passes with valid options', () => {
      const agent = new ServiceAgent({ secret: 'service' })
      expect(agent).to.be.instanceOf(ServiceAgent)
    })

  })

  describe('generate/validate', () => {

    it('handles array of string secrets', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      return expect(agent.generate()).to.eventually.be.a('string')
        .then((token) => agent.verify(token))
    })

    it('handles array of strings', () => {
      const agent = new ServiceAgent({ secret: [ 'foo', 'bar' ]})
      return expect(agent.generate()).to.eventually.be.a('string')
        .then((token) => agent.verify(token))
    })

    it('handles functions that return a secret', () => {
      const agent = new ServiceAgent({ secret: () => 'foo' })
      return expect(agent.generate()).to.eventually.be.a('string')
        .then((token) => agent.verify(token))
    })

    it('handles functions that return an array of secrets', () => {
      const agent = new ServiceAgent({ secret: () => [ 'foo', 'bar' ]})
      return expect(agent.generate()).to.eventually.be.a('string')
        .then((token) => agent.verify(token))
    })

    it('handles functions that return promises', () => {
      const agent = new ServiceAgent({
        secret: () => Promise.resolve('foo')
      })
      return expect(agent.generate()).to.eventually.be.a('string')
        .then((token) => agent.verify(token))
    })

    it('handles functions that return promises with array of strings', () => {
      const agent = new ServiceAgent({
        secret: () => Promise.all([ 'foo', 'bar' ])
      })
      return expect(agent.generate()).to.eventually.be.a('string')
        .then((token) => agent.verify(token))
    })

    it('generates a token', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      return expect(agent.generate()).to.eventually.be.a('string')
        .then((token) => {
          expect(token).to.have.length.greaterThan(100)
          expect(token.split('.')).to.have.length(3)
        })
    })

    it('throws error if token generation fails in function', () => {
      const agent = new ServiceAgent({
        secret: () => { throw new Error('foo') }
      })
      return expect(agent.generate()).to.eventually.be.rejectedWith('foo')
    })

    it('throws error if token generation fails in promise', () => {
      const agent = new ServiceAgent({
        secret: () => Promise.reject('foo')
      })
      return expect(agent.generate()).to.eventually.be.rejectedWith('foo')
    })

    it('generates a token with overriding options', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      const options = { audience: 'bar' }
      return agent.generate(options)
        .then((token) => agent.verify(token, options))
    })

    it('fails if expired', () => {
      const agent = new ServiceAgent({
        secret: 'foo',
        expire: 1
      })
      return agent.generate()
        .tap(() => Promise.delay(1001))
        .then((token) => {
          return expect(agent.verify(token))
            .to.be.rejectedWith(jwt.TokenExpiredError)
        })
    })

    it('fails if secret is different', () => {
      const agent1 = new ServiceAgent({ secret: 'foo' })
      const agent2 = new ServiceAgent({ secret: 'bar' })
      return agent1.generate()
        .then((token) => {
          return expect(agent2.verify(token))
            .to.be.rejectedWith(jwt.JsonWebTokenError)
        })
    })

    it('works if one of the two tokens works', () => {
      const agent1 = new ServiceAgent({ secret: 'foo' })
      const agent2 = new ServiceAgent({ secret: [ 'bar', 'foo' ]})
      return agent1.generate()
        .then((token) => agent2.verify(token))
    })

    it('fails if token is reused more than once', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      let theToken
      return agent.generate()
        .then((token) => {
          theToken = token
          return agent.verify(theToken)
        })
        .then(() => {
          return expect(agent.verify(theToken))
            .to.eventually.be.rejectedWith('Token has already been used')
        })
    })

    it('allows the payload to be sent across verify', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      return agent.generate(null, { foo: 'bar' })
        .then((token) => {
          return agent.verify(token)
        })
        .then((payload) => {
          expect(payload).to.have.property('foo', 'bar')
        })
    })

  })

  describe('request', () => {

    it('should make request with secret in header', () => {
      nock('http://example.com')
        .get('/')
        .reply(function() {
          if (this.req.headers.authorization) {
            return [ 200, 'success' ]
          }
          return [ 400, 'failure' ]
        })
      const agent = new ServiceAgent({ secret: 'foo' })
      return agent
        .request({
          uri: 'http://example.com',
          method: 'GET'
        })
        .then((body) => expect(body).to.be.equal('success'))
    })

    it('should only verify if it\'s within the time period', () => {
      const agent = new ServiceAgent({
        secret: 'foo',
        expire: 1
      })
      nock('http://example.com')
        .get('/')
        .reply(function(uri, requestBody, cb) {
          Promise.delay(1001)
            .then(() => agent.verify(this.req.headers.authorization))
            .then(() => cb(null, [ 200, 'success' ]))
            .catch((err) => cb(null, [ 401, err.message ]))
        })
      const requestPromise = agent.request({
        uri: 'http://example.com',
        method: 'GET'
      })
      return expect(requestPromise).to.eventually.be.rejectedWith(/jwt expired/)
    })

    it('should validate with generate options', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      const options = { audience: 'bar' }
      nock('http://example.com')
        .get('/')
        .reply(function(uri, requestBody, cb) {
          agent.verify(this.req.headers.authorization, options)
            .then(() => cb(null, [ 200, 'success' ]))
            .catch((err) => cb(null, [ 401, err.message ]))
        })
      return agent
        .request({
          uri: 'http://example.com',
          method: 'GET'
        }, options)
        .then((body) => expect(body).to.be.equal('success'))
    })

    it('should fail with invalid generate options', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      const options = { audience: 'bar', subject: 'hello' }
      nock('http://example.com')
        .get('/')
        .reply(function(uri, requestBody, cb) {
          agent.verify(this.req.headers.authorization, options)
            .then(() => cb(null, [ 200, 'success' ]))
            .catch((err) => cb(null, [ 401, err.message ]))
        })
      const requestPromise = agent.request({
        uri: 'http://example.com',
        method: 'GET'
      }, { audience: 'bar' })
      return expect(requestPromise)
        .to.eventually.be.rejectedWith(/jwt subject invalid/)
    })

    it('should fail with invalid secret', () => {
      const agent1 = new ServiceAgent({ secret: 'foo' })
      const agent2 = new ServiceAgent({ secret: 'bar' })
      nock('http://example.com')
        .get('/')
        .reply(function(uri, requestBody, cb) {
          agent2.verify(this.req.headers.authorization)
            .then(() => cb(null, [ 200, 'success' ]))
            .catch((err) => cb(null, [ 401, err.message ]))
        })
      const requestPromise = agent1.request({
        uri: 'http://example.com',
        method: 'GET'
      })
      return expect(requestPromise)
        .to.eventually.be.rejectedWith(/invalid signature/)
    })

    it('should let you use other headers as well', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      nock('http://example.com')
        .get('/')
        .reply(function(uri, requestBody, cb) {
          if (this.req.headers.foo !== 'bar') return [ 500, 'failure' ]
          return agent.verify(this.req.headers.authorization)
            .then(() => cb(null, [ 200, 'success' ]))
            .catch((err) => cb(null, [ 401, err.message ]))
        })
      const requestPromise = agent.request({
        uri: 'http://example.com',
        method: 'GET',
        headers: {
          Foo: 'bar'
        }
      })
      expect(requestPromise)
        .to.eventually.be.equal('success')
    })

    it('sends payload in the request', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      nock('http://example.com')
        .get('/')
        .reply(function(uri, requestBody, cb) {
          return agent.verify(this.req.headers.authorization)
            .then((payload) => {
              expect(payload).to.have.property('foo', 'bar')
              cb(null, [ 200, 'success' ])
            })
            .catch((err) => cb(null, [ 401, err.message ]))
        })
      const requestPromise = agent.request({
        uri: 'http://example.com',
        method: 'GET'
      }, null, { foo: 'bar' })
      expect(requestPromise)
        .to.eventually.be.equal('success')
    })

  })

})
