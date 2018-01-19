'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')

const data = [201, 0, '{"data:2"}']

const buf = pack(...data)
const args = unpack(buf)

describe('pack()', function () {

  it(`should be a buffer and have ${data[2].length + 2} bytes length`, function () {
    Assert.equal(data[2].length + 2, buf.byteLength)
  })
})

describe('unpack()', function () {

  for (let i = 0; i < data.length; i++) {

    it(`data[i]: ${ data[i] } should be a equal args[i]: ${ args[i] }`, function () {
      Assert.equal(data[i], args[i])
    })
  }
})
