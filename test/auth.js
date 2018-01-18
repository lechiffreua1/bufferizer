'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')

const pass = require('crypto').randomBytes(16).toString('hex')
const data = [255, pass]

const buf = pack(...data)
const args = unpack(buf)

describe('pack()', function () {

  it(`should be a buffer and have ${pass.length + 1} bytes length` , function () {
    Assert.equal(pass.length + 1, buf.byteLength)
  })
})

describe('unpack()', function () {

  for (let i = 0; i < data.length; i++) {

    it(`data[i]: ${ data[i] } should be a equal args[i]: ${ args[i] }` , function () {
      Assert.equal(data[i], args[i])
    })
  }
})
