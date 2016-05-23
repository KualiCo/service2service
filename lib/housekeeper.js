'use strict'

const memoryHash = Symbol('memoryHash')

const DEFAULT_EXPIRE = 60000

class Housekeeper {

  constructor(options) {
    options = Object.assign({
      errorMessage: 'Value has already been used'
    }, options)
    this[memoryHash] = {}
    this.errorMessage = options.errorMessage
  }

  has(value) {
    return Boolean(this[memoryHash][value])
  }

  add(value, expire) {
    if (expire == null) expire = DEFAULT_EXPIRE
    if (this.has(value)) {
      throw new Error(this.errorMessage)
    }
    this[memoryHash][value] = setTimeout(this.remove.bind(this, value), expire)
  }

  remove(value) {
    clearTimeout(this[memoryHash][value])
    delete this[memoryHash][value]
  }

}

module.exports = Housekeeper
