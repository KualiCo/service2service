'use strict'

const Promise = require('bluebird')

const checkNext = Symbol('checkNext')

module.exports = function tryFallbacks(arr, fn, errType) {
  const lastIndex = arr.length - 1
  return Promise.reduce(arr, (prev, curr, i) => {
    if (prev !== checkNext) return prev
    return fn(curr).catch(errType, (err) => {
      if (i >= lastIndex) throw err
      return checkNext
    })
  }, checkNext)
}
