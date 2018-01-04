'use strict'

const _pack = new Map()

_pack.set(0, packQuery)
_pack.set(1, packBid)
_pack.set(2, packWinImpClickConvPost)
_pack.set(3, packWinImpClickConvPost)
_pack.set(4, packWinImpClickConvPost) // click
_pack.set(5, packWinImpClickConvPost) // conversion
_pack.set(6, packWinImpClickConvPost) // postback
_pack.set(7, packNoBid) // extended statistic
_pack.set(8, packResponseCompressed) // bid response compressed stat object
_pack.set(9, packResponseExtended) // bid response extended stat object
_pack.set(10, packLimits)
_pack.set(11, packLimitsO)
_pack.set(12, packString) // cl
_pack.set(13, packString) // cr
_pack.set(14, packString) // pa
_pack.set(15, packStringWithSubtype) // strings data exchange
_pack.set(16, packFC) // unique
_pack.set(17, packConv) // conversions list
_pack.set(200, packServiceMessage) // technical message

module.exports = {
  _pack
}

function empty () {}

/**
 * @function packBid
 * @description packs passed numbers to buffer
 * @param {number} type - max 255
 * @param {number} id - max 65535
 * @param {number} bid - max 65535
 * @param {number} time - max 65535
 * @returns {object} - buffer 7 byte length
 * */

function packBid (type, id, bid, time) {
  const buf = Buffer.alloc(7)
  buf.writeUInt8(type, 0)
  buf.writeUInt16LE(id, 1)
  buf.writeUInt16LE(bid, 3)
  buf.writeUInt16LE(time < 65535 ? time : 65535, 5)
  return buf
}

/**
 * @function packQuery
 * @description packs passed numbers to buffer
 * @param {number} type - max 255
 * @param {number} id - max 65535
 * @returns {object} - buffer 7 byte length
 * */

function packQuery (type, id) {
  const buf = Buffer.alloc(3)
  buf.writeUInt8(type, 0)
  buf.writeUInt16LE(id, 1)
  return buf
}

/**
 * @function packWinImpClickConvPost
 * @description packs passed numbers to buffer
 * @param {number} type - max 255
 * @param {number} id - max 65535
 * @param {number} bid - max 65535
 * @param {number} price - max 655.35
 * @returns {object} - buffer 7 byte length
 * */

function packWinImpClickConvPost (type, id, bid, price) {
  const buf = Buffer.alloc(7)
  buf.writeUInt8(type, 0)
  buf.writeUInt16LE(id, 1)
  buf.writeUInt16LE(bid, 3)
  buf.writeUInt16LE(parseInt(price * 100), 5)
  return buf
}

/**
 * @function packLimits
 * @description packs passed arguments to buffer
 * @param {number} type - 10
 * @param {object} arr - each value can not be above 65535
 * @param {number} validTo - max - Double
 * @param {number} MPNR - maximum predicted number of requests
 * @returns {object} - buffer
 * */

function packLimits (type, arr, validTo, MPNR) {
  const head = Buffer.alloc(13)
  const buf = Buffer.alloc(arr.length * 2)
  head.writeUInt8(type, 0)
  head.writeUInt32LE(MPNR, 1)
  head.writeDoubleLE(validTo, 5)

  for (let i = 0; i < arr.length; i++) {
    buf.writeUInt16LE(arr[i], i * 2)
  }
  return Buffer.concat([head, buf])
}

/**
 * @function packLimitsO
 * @description packLimits wrapper for quotes
 * @param {number} type - 10
 * @param {object} arr - each value can not be above 65535
 * @param {number} validTo - max - Double
 * @param {number} MPNR - maximum predicted number of requests
 * @param {object} obj - quotes each key or value can not be above 65535
 * @returns {object} - buffer
 * */

function packLimitsO (type, arr, validTo, MPNR, obj) {
  const limits = packLimits(...arguments).slice(1)
  const l = limits.byteLength

  const head = Buffer.alloc(3)
  head.writeUInt8(type, 0)
  head.writeUInt16LE(l, 1)

  const keys = Object.keys(obj)
  const body = Buffer.alloc(keys.length * 4)

  for (let i = 0; i < keys.length; i++) {
    body.writeUInt16LE(+keys[i], i * 4)
    body.writeUInt16LE(obj[keys[i]], i * 4 + 2)
  }

  return Buffer.concat([head, limits, body])
}

/**
 * @function packNoBid
 * @description unpack no bid buffer
 * @param {number} type -
 * @param {number} sspId -
 * @param {number} countryId -
 * @param {number} osId -
 * @param {number} browserId -
 * @param {number} reason -
 * @param {number} bidFloor -
 * @returns {object} - buffer
 * */

function packNoBid (type, sspId, countryId, osId, browserId, reason, bidFloor) {
  const now = Date.now()
  const hour = (now - (now % 36e5)) / 1e5
  // type 1, hour = 4, sspId = 2, countryId = 1,
  // osId = 1, browserId = 1, reason = 1, bidFloor = 4
  const buf = Buffer.alloc(15)

  buf.writeUInt8(type, 0)
  buf.writeUInt32LE(hour, 1)
  buf.writeUInt16LE(sspId, 5)
  buf.writeUInt8(browserId, 7)
  buf.writeUInt8(countryId, 8)
  buf.writeUInt8(osId, 9)
  buf.writeUInt8(reason, 10)
  buf.writeFloatLE(bidFloor, 11)

  return buf
}

/**
 * @function packString
 * @description pack string and type
 * @param {number} type -
 * @param {string} string -
 * @returns {object} - buffer
 * */

function packString (type, string) {
  const head = Buffer.alloc(1)
  head.writeUInt8(type, 0)
  return Buffer.concat([head, Buffer.from(string)])
}

/**
 * @function packStringWithSubtype
 * @description pack string, type and subType
 * @param {number} type -
 * @param {number} subType -
 * @param {string} string -
 * @returns {object} - buffer
 * */

function packStringWithSubtype (type, subType, string) {
  const head = Buffer.alloc(2)
  head.writeUInt8(type, 0)
  head.writeUInt8(subType, 1)
  return Buffer.concat([head, Buffer.from(string)])
}

/**
 * @function packServiceMessage
 * @description pack service message
 * @param {number} type -
 * @param {number} commandType - 0 - stop, 1 - start, 2 - started, 3 - paused, 4 - done, 5 - error
 * @param {number} commandCode - get from library
 * @param {number} startTS - time
 * @returns {object} - buffer
 * */

function packServiceMessage (type, commandType, commandCode, startTS) { // command => procedure
  const buf = Buffer.alloc(11)
  buf.writeUInt8(type, 0)
  buf.writeUInt8(commandType, 1)
  buf.writeUInt8(commandCode, 2)
  buf.writeDoubleLE(startTS, 3)
  return buf
}

/**
 * @function packResponseCompressed
 * @description pack bid response information for statistic
 * @param {number} type -
 * @param {string} hash -
 * @param {number} ts -
 * @param {number} ipInt -
 * @param {number} countryId -
 * @param {number} osId -
 * @param {number} osv -
 * @param {number} browserId -
 * @param {number} brv -
 * @param {number} crid -
 * @param {number} sspId -
 * @param {number} mAbs - markup abs
 * @param {number} rp - response price
 * @returns {object} - buffer
 * */

function packResponseCompressed (type, hash, ts, ipInt, countryId, osId, osv, browserId, brv, crid, sspId, mAbs, rp) {

  // type 1, hash = dynamic
  const buf = Buffer.alloc(34)

  // ts = 8, ipInt = 8, countryId = 1, osId = 1, osv = 1,
  // browserId = 1, brv = 1, crid = 2, sspId = 2, mAbs = 4, rp = 4

  buf.writeUInt8(type, 0) // 1
  buf.writeDoubleLE(ts, 1) // 8
  buf.writeDoubleLE(ipInt, 9) // 8
  buf.writeUInt8(countryId, 17) // 1
  buf.writeUInt8(osId, 18) // 1
  buf.writeUInt8(osv, 19) // 1
  buf.writeUInt8(browserId, 20) // 1
  buf.writeUInt8(brv, 21) // 1
  buf.writeUInt16LE(crid, 22) // 2
  buf.writeUInt16LE(sspId, 24) // 2
  buf.writeFloatLE(mAbs, 26) // 4
  buf.writeFloatLE(rp, 30) // 4

  return Buffer.concat([buf, Buffer.from(hash)])
}

function packResponseExtended (type, obj) {
  // todo
}

/**
 * @function packFC
 * @description pack frequency cap information for unique
 * @param {number} type -
 * @param {number} isBid -
 * @param {number} ipInt -
 * @param {string} fcPK -
 * @returns {object} - buffer
 * */

function packFC (type, isBid, ipInt, fcPK) {
  const buf = Buffer.alloc(10)
  buf.writeUInt8(type, 0) // 1
  buf.writeUInt8(isBid, 1) // 1
  buf.writeDoubleLE(ipInt, 2) // 8

  return Buffer.concat([buf, Buffer.from(fcPK)])
}

/**
 * @function packConv
 * @description pack conversions list for incoming
 * @param {number} type
 * @param {object} array
 * @returns {object} - buffer
 */

function packConv (type, array) {
  let offset = 1
  const buf = Buffer.alloc(array.length * 5 + offset)  // 1 - type, 2 - userId, 2- convId, 1 - convType
  buf.writeUInt8(type, 0)

  for (let i = 0; i < array.length; i++) {
    const { userId, convId, convType } = array[i]
    buf.writeUInt16LE(userId, offset)
    buf.writeUInt16LE(convId, offset + 2)
    buf.writeUInt8(convType, offset + 4)
    offset += 5
  }
  return buf
}
