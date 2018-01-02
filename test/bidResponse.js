'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')

const data = [
  8,
  require('crypto').randomBytes(16).toString('hex'),
  Date.now(),
  4280427015, // ip
  15,
  44,
  2,
  45,
  56,
  33,
  129,
  0.365,
  1.34
]

const buf = pack(...data)
const args = unpack(buf)

describe('pack()', function () {

  it(`should be a buffer and have 66 bytes length` , function () {
    Assert.equal(66, buf.byteLength)
  })
})

describe('unpack()', function () {

  for (let i = 0; i < data.length - 2; i++) {

    it(`data[i]: ${ data[i] } should be a equal args[i]: ${ args[i] }` , function () {
      Assert.equal(data[i], args[i])
    })
  }

  it(`data[${data.length - 2}]: ${ parseInt(data[data.length - 2] * 1000) } should be a equal args[${args.length - 2}]: ${ parseInt(args[args.length - 2] * 1000) }` , function () {
    Assert.equal(parseInt(data[data.length - 2] * 1000), parseInt(args[data.length - 2] * 1000))
  })

  it(`data[${data.length - 1}]: ${ parseInt(data[data.length - 1] * 100) } should be a equal args[${args.length - 1}]: ${ parseInt(args[args.length - 1] * 100) }` , function () {
    Assert.equal(parseInt(data[data.length - 1] * 100), parseInt(args[data.length - 1] * 100))
  })

})
