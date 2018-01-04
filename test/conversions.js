'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')

const type = 17
const conversions = [
  {userId: 23, convId: 12, convType: 1},
  {userId: 233, convId: 42, convType: 2},
  {userId: 223, convId: 123, convType: 2}
]

const buf = pack(type, conversions)
const [ unpackedType, unpackedData ] = unpack(buf)

describe('pack()', function () {

  it(`should be a buffer and have 16 bytes length` , function () {
    Assert.equal(16, buf.byteLength)
  })
})

describe('unpack()', function () {

  it('pack type should be strict equal to 17', function () {
    Assert.strictEqual(type, unpackedType)
  })

  it('should be equal to initial conversions array', function () {
    for (let i = 0; i < unpackedData.length; i++) {
      Assert.deepStrictEqual(conversions[i], unpackedData[i])
    }
  })
})