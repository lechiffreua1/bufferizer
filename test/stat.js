'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')
const arr0 = [0, 65535]
const arr1= [1, 65535, 65535, 65535]
const arr23 = [2, 65535, 65535, 655.35]
const buf0 = pack(...arr0)
const buf1 = pack(...arr1)
const buf23 = pack(...arr23)
const result0 = unpack(buf0)
const result1 = unpack(buf1)
const result23 = unpack(buf23)

describe('pack()', function () {

  it('should returns buffer with length equal 3 bytes', function () {
    Assert.equal(3, buf0.length)
  })

  it('should returns buffer with length equal 7 bytes', function () {
    Assert.equal(7, buf1.length)
  })

  it('should returns buffer with length equal 7 bytes', function () {
    Assert.equal(7, buf23.length)
  })
})

describe('unpack()', function () {

  it('should returns array with length equal 2', function () {
    Assert.equal(2, result0.length)
  })

  for (let i = 0; i < result0.length; i++) {

    it(`should be equal ${arr0[i]}`, function () {
      Assert.equal(arr0[i], result0[i])
    })
  }

  it('should returns array with length equal 4', function () {
    Assert.equal(4, result1.length)
  })

  for (let i = 0; i < result1.length; i++) {

    it(`should be equal ${arr1[i]}`, function () {
      Assert.equal(arr1[i], result1[i])
    })
  }

  it('should returns array with length equal 4', function () {
    Assert.equal(4, result23.length)
  })

  for (let i = 0; i < result23.length; i++) {

    it(`should be equal ${arr23[i]}`, function () {
      Assert.equal(arr23[i], result23[i])
    })
  }
})
