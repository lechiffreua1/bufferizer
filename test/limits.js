'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')
const { expect } = require('chai')
const now = Date.now()
const arr = [1, 2, 3, 65535]
const buf = pack(10, arr, now)
const obj = { '10': 20, '30': 10000 }
const buf11 = pack(11, arr, now, obj)

describe('pack()', function () {

  it(`should returns buffer with length equal ${9 + arr.length * 2} bytes`, function () {
    Assert.equal(9 + arr.length * 2, buf.length)
  })

  it(`should returns buffer with length equal ${9 + arr.length * 2 + Object.keys(obj).length * 4} bytes`, function () {
    Assert.equal(11 + arr.length * 2 + Object.keys(obj).length * 4, buf11.length)
  })
})

describe('unpack() 10', function () {
  const [type, obj] = unpack(buf)

  it('should be a number', function () {
    expect(type).to.be.a('number')
  })

  it('should be an object', function () {
    expect(obj).to.be.an('object')
  })

  it('should be an array', function () {
    expect(obj.data).to.be.an('array')
  })

  it(`should be equal ${now}`, function () {
    Assert.equal(now, obj.validTo)
  })
})

describe('unpack() 11', function () {
  const [type, obj1, obj2] = unpack(buf11)

  it('should be a number', function () {
    expect(type).to.be.a('number')
  })

  it(`${obj1} should be an object`, function () {
    expect(obj1).to.be.an('object')
  })

  it(`${obj2} should be an object`, function () {
    expect(obj2).to.be.an('object')
  })

  it('should be an array', function () {
    expect(obj1.data).to.be.an('array')
  })

  it(`should be equal ${now}`, function () {
    Assert.equal(now, obj1.validTo)
  })
})

