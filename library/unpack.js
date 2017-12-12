'use strict'

const _unpack = new Map()

_unpack.set(0, unpackQuery)
_unpack.set(1, unpackBid)
_unpack.set(2, unpackQueryWinImp)
_unpack.set(3, unpackQueryWinImp)
_unpack.set(4, empty) // click
_unpack.set(5, empty) // conversion
_unpack.set(6, empty) // postback
_unpack.set(7, unpackNoBid) // no bid
_unpack.set(10, unpackLimits)
_unpack.set(11, unpackLimitsO)
_unpack.set(12, unpackString) // cl
_unpack.set(13, unpackString) // cr
_unpack.set(14, unpackString) // pa
_unpack.set(15, unpackStringWithSubtype) // string data exchange
_unpack.set(200, unpackServiceMessage) // technical message

module.exports = {
  _unpack
}

function empty () {}

/**
 * @function unpackBid
 * @description unpacks numbers from buffer
 * @param {object} buf - 7 byte length buffer
 * @returns {object} - array
 * */

function unpackBid (buf) {
  return [
    buf.readUInt8(0),
    buf.readUInt16LE(1),
    buf.readUInt16LE(3),
    buf.readUInt16LE(5)
  ]
}

/**
 * @function unpackQuery
 * @description unpacks numbers from buffer
 * @param {object} buf - 3 byte length buffer
 * @returns {object} - array
 * */

function unpackQuery (buf) {
  return [
    buf.readUInt8(0),
    buf.readUInt16LE(1)
  ]
}

/**
 * @function unpackQueryWinImp
 * @description unpacks numbers from buffer
 * @param {object} buf - 7 byte length buffer
 * @returns {object} - array
 * */

function unpackQueryWinImp (buf) {
  return [
    buf.readUInt8(0),
    buf.readUInt16LE(1),
    buf.readUInt16LE(3),
    buf.readUInt16LE(5) / 100
  ]
}

/**
 * @function unpackLimits
 * @description unpacks data from buffer
 * @param {object} buf -
 * @returns {object} - array [type, data]
 * */

function unpackLimits (buf) {
  const set = new Set()
  const sub = buf.slice(13)

  for (let i = 0; i < sub.byteLength / 2; i++) {
    set.add(sub.readUInt16LE(i * 2))
  }

  return [buf.readUInt8(0), buf.readUInt32LE(1), {
    data: Array.from(set),
    validTo: buf.readDoubleLE(5)
  }]
}

/**
 * @function unpackLimitsO
 * @description unpackLimits wrapper for quotes
 * @param {object} buf -
 * @returns {object} - array [type, data, obj2]
 * */

function unpackLimitsO (buf) {
  const l = buf.readUInt16LE(1)
  const limits = Buffer.concat([buf.slice(0, 1), buf.slice(3, l + 3)])
  const body = buf.slice(l + 3)
  const obj = {}

  for (let i = 0; i < body.byteLength / 4; i++) {
    const key = body.readUInt16LE(i * 4)
    obj[key] = body.readUInt16LE(i * 4 + 2)
  }

  const [type, MPNR, mainObj] = unpackLimits(limits)

  return [11, MPNR, mainObj, obj]
}

/**
 * @function unpackNoBid
 * @description unpack no bid buffer
 * @param {object} buf -
 * @returns {object} - array [type, sspId, countryId, osId, browserId, reason, place, bidFloor]
 * */

function unpackNoBid (buf) {

  return [buf.readUInt8(0), // type
    buf.readUInt32LE(1), // hour
    buf.readUInt8(5), // sspId
    buf.readUInt8(6), // countryId
    buf.readUInt8(7), // osId
    buf.readUInt8(8), // browserId
    buf.readUInt8(9), // reason
    buf.readUInt8(10), // place
    buf.readFloatLE(11) // bidFloor
  ]
}

/**
 * @function unpackString
 * @description unpack string, return type
 * @param {object} buf -
 * @returns {object} - array [type, string]
 * */

function unpackString (buf) {
  return [
    buf.readUInt8(0),
    buf.slice(1).toString('utf8')
  ]
}

/**
 * @function unpackStringWithSubtype
 * @description unpack string, return type and subtype
 * @param {object} buf -
 * @returns {object} - array [type, subtype, string]
 * */

function unpackStringWithSubtype (buf) {
  return [
    buf.readUInt8(0),
    buf.readUInt8(1),
    buf.slice(2).toString('utf8')
  ]
}

/**
 * @function unpackServiceMessage
 * @description unpack service message
 * @param {object} buf -
 * @returns {object} - array [type, commandType, commandCode, startTS]
 * */

function unpackServiceMessage (buf) {
  return [buf.readUInt8(0), buf.readUInt8(1), buf.readUInt8(2), buf.readDoubleLE(3)]
}
