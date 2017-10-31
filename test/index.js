'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')
const arr = [0, 65535, 65535, 655.35]
const buf = pack(...arr)
const result = unpack(buf)

describe('pack()', function () {

  it('should returns buffer with length equal 7 bytes', function () {
    Assert.equal(7, buf.length)
  })
})

describe('unpack()', function () {

  it('should returns array with length equal 4', function () {
    Assert.equal(4, result.length)
  })

  for (let i = 0; i < result.length; i++) {

    it(`should be equal ${arr[i]}`, function () {
      Assert.equal(arr[i], result[i])
    })
  }
})
