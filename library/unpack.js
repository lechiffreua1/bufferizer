'use strict'

const _unpack = new Map()

_unpack.set(0, unpackQuery)
_unpack.set(1, unpackBid)
_unpack.set(2, unpackWinImpClickConvPost)
_unpack.set(3, unpackWinImpClickConvPost)
_unpack.set(4, unpackWinImpClickConvPost) // click
_unpack.set(5, unpackWinImpClickConvPost) // conversion
_unpack.set(6, unpackWinImpClickConvPost) // postback
_unpack.set(7, unpackNoBid) // no bid
_unpack.set(8, unpackResponseCompressed) // no bid
_unpack.set(9, unpackResponseExtended) // no bid
_unpack.set(10, unpackLimits)
_unpack.set(11, unpackLimitsO)
_unpack.set(12, unpackString) // cl
_unpack.set(13, unpackString) // cr
_unpack.set(14, unpackString) // pa
_unpack.set(15, unpackStringWithSubtype) // string data exchange
_unpack.set(16, unpackFC) // string data exchange
_unpack.set(17, unpackConv) // conversions list
_unpack.set(18, unpackString) // conversion
_unpack.set(19, unpackString) // gps targeting
_unpack.set(20, unpackGps)    // gps targeting list
_unpack.set(200, unpackServiceMessage) // technical message
_unpack.set(201, unpackInfoMessage) // info message
_unpack.set(255, unpackAuth) // authentication message

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
 * @function unpackWinImpClickConvPost
 * @description unpacks numbers from buffer
 * @param {object} buf - 7 byte length buffer
 * @returns {object} - array
 * */

function unpackWinImpClickConvPost (buf) {
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
 * @returns {object} - array [type, hour, sspId, browserId, countryId, osId, reason, bidFloor]
 * */

function unpackNoBid (buf) {
  // type 1, hour = 4, sspId = 2, countryId = 1,
  // osId = 1, browserId = 1, reason = 1, bidFloor = 4

  return [buf.readUInt8(0), // type
    buf.readUInt32LE(1), // hour
    buf.readUInt16LE(5), // sspId
    buf.readUInt8(7), // countryId
    buf.readUInt8(8), // browserId
    buf.readUInt8(9), // osId
    buf.readUInt8(10), // reason
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

/**
 * @function unpackInfoMessage
 * @description unpack response with information
 * @param {object} buf -
 * @returns {object} - array [type, commandType, data]
 * */

function unpackInfoMessage (buf) {
  return [
    buf.readUInt8(0),
    buf.readUInt8(1),
    buf.slice(2, buf.byteLength).toString('utf8')
  ]
}

/**
 * @function unpackResponseCompressed
 * @description unpack bid response information for statistic
 * @param {object} buf -
 * @returns {object} - array [type, hash, ts, ipInt, countryId, osId, osv, browserId, brv, crid, sspId, markupAbs, responsePrice]
 * */

function unpackResponseCompressed (buf) {

  return [
    buf.readUInt8(0), // type,
    buf.slice(34).toString('utf8'), // hash,
    buf.readDoubleLE(1), // ts,
    buf.readDoubleLE(9), // ipInt,
    buf.readUInt8(17), // countryId,
    buf.readUInt8(18), // osId,
    buf.readUInt8(19), // osv,
    buf.readUInt8(20), // browserId,
    buf.readUInt8(21), // brv,
    buf.readUInt16LE(22), // crid,
    buf.readUInt16LE(24), // sspId,
    buf.readFloatLE(26), // mAbs,
    buf.readFloatLE(30) // rp
  ]
}

function unpackResponseExtended (type, obj) {
  // todo
}

function unpackFC (buf) {

  return [
    buf.readUInt8(0), // type,
    buf.readUInt8(1), // isBid,
    buf.readDoubleLE(2), // ipInt,
    buf.slice(10).toString('utf8') // fcPK
  ]
}

/**
 * @function unpackConv
 * @description unpack conversions array of objects
 * @param {object} buf
 * @returns {[number, object]}
 */

function unpackConv (buf) {
  const objectsArray = []
  const data = buf.slice(1)
  let offset = 0

  for (let i = 0; i < data.byteLength / 5; i++) {
    objectsArray.push({
      userId: data.readUInt16LE(offset),
      convId: data.readUInt16LE(offset + 2),
      convType: data.readUInt8(offset + 4)
    })
    offset += 5
  }
  return [buf.readUInt8(0), objectsArray]
}

/**
 * @function unpackGps
 * @description unpack gps targeting array of objects
 * @param {object} buf
 * @returns {object} - array [number, object]
 */

function unpackGps (buf) {
  const objectsArray = []
  const data = buf.slice(1)
  let offset = 0

  for (let i = 0; i < data.byteLength / 20; i++) {
    objectsArray.push({
      bid: data.readUInt16LE(offset),
      lat: data.readDoubleLE(offset + 2),
      lon: data.readDoubleLE(offset + 10),
      radius: data.readUInt16LE(offset + 18)
    })
    offset += 20
  }
  return [buf.readUInt8(0), objectsArray]
}

/**
 * @function unpackAuth
 * @description pack auth data
 * @param {object} buf
 * @returns {object} - array [type, password]
 */

function unpackAuth (buf) {

  return [
    buf.readUInt8(0),
    buf.slice(1, buf.byteLength).toString()
  ]
}
