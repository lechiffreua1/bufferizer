'use strict'

const { pack, unpack } = require('../index')
const Assert = require('assert')

const type = 20
const campaignGps = [
  {bid: 555, lat: -0.60003918, lon: 2.64309683, radius: 10},
  {bid: 3312, lat: 0.52857187, lon: -1.70578139, radius: 4},
  {bid: 640, lat: 0.94859846, lon: -0.10002839, radius: 605}
]
const version = 1516372744924

const buf = pack(type, campaignGps, version)
const [ unpackedType, unpackedVersion, unpackedData ] = unpack(buf)

describe('pack()', function () {

  it(`should be a buffer and have 61 bytes length` , function () {
    Assert.equal(69, buf.byteLength)
  })
})

describe('unpack()', function () {

  it('pack type should be strict equal to 20', function () {
    Assert.strictEqual(type, unpackedType)
  })

  it('version should be strict equal to 1516372744924', function () {
    Assert.strictEqual(version, unpackedVersion)
  })

  it('should be equal to initial conversions array', function () {
    for (let i = 0; i < unpackedData.length; i++) {
      Assert.deepStrictEqual(campaignGps[i], unpackedData[i])
    }
  })
})