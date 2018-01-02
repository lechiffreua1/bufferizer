'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')

const data = [
  16,
  1,
  4280427015, // ip
  require('crypto').randomBytes(16).toString('hex')
]

const buf = pack(...data)
const args = unpack(buf)

describe('pack()', function () {

  it(`should be a buffer and have 42 bytes length` , function () {
    Assert.equal(42, buf.byteLength)
  })
})

describe('unpack()', function () {

  for (let i = 0; i < data.length; i++) {

    it(`data[i]: ${ data[i] } should be a equal args[i]: ${ args[i] }` , function () {
      Assert.equal(data[i], args[i])
    })
  }
})
