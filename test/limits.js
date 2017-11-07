'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')
const { expect } = require('chai')
const now = Date.now()
const arr = [1, 2, 3, 65535]
const buf = pack(10, arr, now, 999)
const obj = { '10': 20, '30': 10000, 7777: 555 }
const buf11 = pack(11, arr, now, 999, obj)

describe('pack()', function () {

  it(`should returns buffer with length equal ${11 + arr.length * 2} bytes`, function () {
    Assert.equal(11 + arr.length * 2, buf.length)
  })

  it(`should returns buffer with length equal ${13 + arr.length * 2 + Object.keys(obj).length * 4} bytes`, function () {
    Assert.equal(13 + arr.length * 2 + Object.keys(obj).length * 4, buf11.length)
  })
})

describe('unpack() 10', function () {
  const [type, MPNR, obj] = unpack(buf)

  it('type should be a number', function () {
    expect(type).to.be.a('number')
  })

  it(`should be equal 10`, function () {
    Assert.equal(10, type)
  })

  it('MPNR should be a number', function () {
    expect(MPNR).to.be.a('number')
  })

  it(`should be equal 999`, function () {
    Assert.equal(999, MPNR)
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
  const [type, MPNR, obj1, obj2] = unpack(buf11)

  it('type should be a number', function () {
    expect(type).to.be.a('number')
  })

  it(`type should be equal 11`, function () {
    Assert.equal(11, type)
  })

  it('MPNR should be a number', function () {
    expect(MPNR).to.be.a('number')
  })

  it(`should be equal 999`, function () {
    Assert.equal(999, MPNR)
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

  for (let key in obj) {
    it(`obj['${key}'] should be equal obj2['${key}']`, function () {
      Assert.equal(obj['30'], obj2['30'])
    })
  }
})

