'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')
const { expect } = require('chai')
const data = [7, 65535, 255, 255, 255, 255, 999.35]
const buf = pack(...data)

describe('pack() 7', function () {

  it(`should returns buffer with length equal 15 bytes`, function () {
    Assert.equal(15, buf.length)
  })
})

describe('unpack() 7', function () {
  const [type, hour, ...arr] = unpack(buf)
  arr.unshift(type) // add type
  arr.push(Math.round(arr.pop() * 100) / 100) // round

  for (let i = 0; i < data.length; i++) {

    it('value should be a number', function () {
      expect(arr[i]).to.be.a('number')
    })

    it(`value should be equal ${data[i]}`, function () {
      Assert.equal(data[i], arr[i])
    })
  }
})
