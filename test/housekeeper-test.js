'use strict'

const chai = require('chai')
const Promise = require('bluebird')
const Housekeeper = require('../lib/housekeeper')

const expect = chai.expect

describe('Housekeeper', () => {

  it('adds a value to the memory', () => {
    const maid = new Housekeeper()
    expect(maid.has('foo')).to.be.equal(false)
    maid.add('foo', 1)
    expect(maid.has('foo')).to.be.equal(true)
    return Promise.delay(1).then(() => {
      expect(maid.has('foo')).to.be.equal(false)
    })
  })

  it('throws if a value has already been added', () => {
    const maid = new Housekeeper()
    maid.add('foo')
    expect(() => maid.add('foo')).to.throw('Value has already been used')
  })

  it('allows manual removal from house', () => {
    const maid = new Housekeeper()
    maid.add('foo', 1000)
    expect(() => maid.add('foo')).to.throw('Value has already been used')
    maid.remove('foo')
    expect(() => maid.add('foo')).to.not.throw()
  })

})
