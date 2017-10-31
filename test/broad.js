'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')
const Crypto = require('crypto')

const data = []
for (let i = 0; i < 10; i++) {
  data.push(random(i * 5 + 10))
}

const packs = []

describe('pack()', function () {
  for (let i = 0; i < data.length; i++) {
    packs.push(pack(12, data[i]))

    it(`should be a buffer and have ${data[i].length + 1} bytes length` , function () {
      Assert.equal(data[i].length + 1, packs[i].byteLength)
    })
  }
})

describe('unpack()', function () {
  for (let i = 0; i < packs.length; i++) {
    const [type, string] = unpack(packs[i])

    it(`should be a string and be equal data[${i}]` , function () {
      Assert.equal(string, data[i])
    })
  }
})

function random (l) {
  return Crypto.randomBytes(l).toString('hex')
}

