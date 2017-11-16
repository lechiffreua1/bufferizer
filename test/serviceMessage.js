'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')
const { expect } = require('chai')
const now = Date.now()
const descriptions = ['type', 'commandType', 'command', 'startTS']
const arr = [200, 0, 1, now]
const buf = pack(...arr)
const result = unpack(buf)

describe('pack() 200', function () {

  it(`should returns buffer with length equal 11 bytes`, function () {
    Assert.equal(11, buf.byteLength)
  })
})

describe('unpack() 200', function () {

  for (let i = 0; i < result.length; i++) {
    it(`${descriptions[i]} should be a number`, function () {
      expect(result[i]).to.be.a('number')
    })

    it(`${descriptions[i]} should be equal ${arr[i]}`, function () {
      Assert.equal(arr[i], result[i])
    })
  }
})
