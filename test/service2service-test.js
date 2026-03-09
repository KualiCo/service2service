'use strict'
/* eslint-disable max-statements */

const chai = require('chai')
const Promise = require('bluebird')
const jwt = require('jsonwebtoken')
const nock = require('nock')
const ServiceAgent = require('../index')
const requestOptionsToAxios = require('../helpers/requestOptionsToAxios')
const executeAxiosRequest = requestOptionsToAxios.executeAxiosRequest

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

    it('fails if there is no secret', () => {
      const agent1 = new ServiceAgent({ secret: 'foo' })
      const agent2 = new ServiceAgent({ secret: []})
      return agent1.generate()
        .then((token) => {
          return expect(agent2.verify(token))
            .to.eventually.be.rejectedWith('At least one secret is required')
        })
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

    it('works if disableSingleUse is set to true', () => {
      const agent = new ServiceAgent({ secret: 'foo', disableSingleUse: true })
      let theToken
      return agent.generate()
        .then((token) => {
          theToken = token
          return agent.verify(theToken)
        })
        .then(() => {
          return agent.verify(theToken)
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

    it('should handle when url is already provided (not uri)', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      nock('http://example.com')
        .get('/')
        .reply(200, 'success')
      return agent.request({
        url: 'http://example.com',
        method: 'GET'
      })
        .then((body) => expect(body).to.be.equal('success'))
    })

    it('should handle non-HTTP errors (network errors)', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      // Use nock to simulate a network error (no response)
      nock('http://example.com')
        .get('/network-error')
        .replyWithError('Network error')
      const requestPromise = agent.request({
        uri: 'http://example.com/network-error',
        method: 'GET'
      })
      return expect(requestPromise)
        .to.eventually.be.rejectedWith('Network error')
    })

    it('should handle HTTP errors when response.data is falsy', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      nock('http://example.com')
        .get('/')
        .reply(401, null) // null response body
      return agent.request({
        uri: 'http://example.com',
        method: 'GET'
      })
        .catch((err) => {
          expect(err.statusCode).to.equal(401)
          expect(err).to.have.property('response')
        })
    })

    it('should convert qs to params for axios compatibility', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      nock('http://example.com')
        .get('/')
        .query({ foo: 'bar' })
        .reply(200, 'success')
      return agent.request({
        uri: 'http://example.com',
        method: 'GET',
        qs: { foo: 'bar' }
      })
        .then((body) => expect(body).to.be.equal('success'))
    })

    it('should convert body to data for axios compatibility', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      nock('http://example.com')
        .post('/', { foo: 'bar' })
        .reply(200, 'success')
      return agent.request({
        uri: 'http://example.com',
        method: 'POST',
        body: { foo: 'bar' }
      })
        .then((body) => expect(body).to.be.equal('success'))
    })

    it('should remove json option without breaking', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      nock('http://example.com')
        .get('/')
        .reply(200, 'success')
      return agent.request({
        uri: 'http://example.com',
        method: 'GET',
        json: true
      })
        .then((body) => expect(body).to.be.equal('success'))
    })

    it('should include error and response in HTTP errors', () => {
      const agent = new ServiceAgent({ secret: 'foo' })
      nock('http://example.com')
        .get('/')
        .reply(500, { message: 'Server error' })
      return agent.request({
        uri: 'http://example.com',
        method: 'GET'
      })
        .catch((err) => {
          expect(err.statusCode).to.equal(500)
          expect(err.error).to.deep.equal({ message: 'Server error' })
          expect(err).to.have.property('response')
        })
    })

  })

  describe('helpers/requestOptionsToAxios', () => {

    describe('requestOptionsToAxios', () => {

      it('converts uri to url when url is not set', () => {
        const opts = { uri: 'http://example.com', method: 'GET' }
        requestOptionsToAxios(opts)
        expect(opts).to.have.property('url', 'http://example.com')
        expect(opts).to.not.have.property('uri')
      })

      it('does not overwrite url when uri is also present', () => {
        const opts = { uri: 'http://other.com', url: 'http://example.com' }
        requestOptionsToAxios(opts)
        expect(opts.url).to.equal('http://example.com')
      })

      it('converts qs to params when params is not set', () => {
        const opts = { url: 'http://example.com', qs: { foo: 'bar' }}
        requestOptionsToAxios(opts)
        expect(opts).to.have.property('params')
        expect(opts.params).to.deep.equal({ foo: 'bar' })
        expect(opts).to.not.have.property('qs')
      })

      it('does not overwrite params when qs is also present', () => {
        const opts = {
          url: 'http://example.com',
          qs: { a: 1 },
          params: { b: 2 }
        }
        requestOptionsToAxios(opts)
        expect(opts.params).to.deep.equal({ b: 2 })
        expect(opts).to.have.property('qs')
      })

      it('converts body to data when data is not set', () => {
        const opts = {
          url: 'http://example.com',
          method: 'POST',
          body: { x: 1 }
        }
        requestOptionsToAxios(opts)
        expect(opts).to.have.property('data')
        expect(opts.data).to.deep.equal({ x: 1 })
        expect(opts).to.not.have.property('body')
      })

      it('does not overwrite data when body is also present', () => {
        const opts = {
          url: 'http://example.com',
          method: 'POST',
          body: { from: 'body' },
          data: { from: 'data' }
        }
        requestOptionsToAxios(opts)
        expect(opts.data).to.deep.equal({ from: 'data' })
        expect(opts).to.have.property('body')
      })

      it('converts body to data for PUT', () => {
        const opts = {
          url: 'http://example.com/item',
          method: 'PUT',
          body: { name: 'updated' }
        }
        requestOptionsToAxios(opts)
        expect(opts.data).to.deep.equal({ name: 'updated' })
        expect(opts).to.not.have.property('body')
      })

      it('removes json option', () => {
        const opts = { url: 'http://example.com', json: true }
        requestOptionsToAxios(opts)
        expect(opts).to.not.have.property('json')
      })

    })

    describe('executeAxiosRequest', () => {

      it('returns only response body by default', () => {
        nock('http://example.com')
          .get('/')
          .reply(200, 'success')
        return executeAxiosRequest({
          url: 'http://example.com',
          method: 'GET'
        }).then((result) => {
          expect(result).to.equal('success')
        })
      })

      it('returns full response when resolveWithFullResponse is true', () => {
        nock('http://example.com')
          .get('/')
          .reply(200, 'ok')
        return executeAxiosRequest({
          url: 'http://example.com',
          method: 'GET',
          resolveWithFullResponse: true
        }).then((result) => {
          expect(result).to.have.property('statusCode', 200)
          expect(result).to.have.property('headers')
          expect(result).to.have.property('body', 'ok')
        })
      })

      it('resolves with body on 4xx when simple is false', () => {
        nock('http://example.com')
          .get('/not-found')
          .reply(404, { error: 'Not found' })
        return executeAxiosRequest({
          url: 'http://example.com/not-found',
          method: 'GET',
          simple: false
        }).then((body) => {
          expect(body).to.deep.equal({ error: 'Not found' })
        })
      })

      it('rejects with err with statusCode and response on HTTP error', () => {
        nock('http://example.com')
          .get('/')
          .reply(500, { message: 'Server error' })
        return executeAxiosRequest({
          url: 'http://example.com',
          method: 'GET'
        }).catch((err) => {
          expect(err).to.be.instanceOf(Error)
          expect(err.statusCode).to.equal(500)
          expect(err.error).to.deep.equal({ message: 'Server error' })
          expect(err).to.have.property('response')
        })
      })

      it('preserves response headers and config on rejected error', () => {
        nock('http://example.com')
          .get('/')
          .reply(500, { message: 'Server error' })
        return executeAxiosRequest({
          url: 'http://example.com',
          method: 'GET'
        }).catch((err) => {
          expect(err.response).to.have.property('headers')
          expect(err.response).to.have.property('status', 500)
        })
      })

      it('passes through custom headers in the request', () => {
        nock('http://example.com')
          .get('/')
          .matchHeader('x-custom', 'my-value')
          .reply(200, 'ok')
        return executeAxiosRequest({
          url: 'http://example.com',
          method: 'GET',
          headers: { 'X-Custom': 'my-value' }
        }).then((result) => {
          expect(result).to.equal('ok')
        })
      })

    })

  })

})
