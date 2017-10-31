'use strict'

const _pack = new Map()

_pack.set(0, packQuery)
_pack.set(1, packBid)
_pack.set(2, packQueryWinImp)
_pack.set(3, packQueryWinImp)
_pack.set(4, empty) // click
_pack.set(5, empty) // conversion
_pack.set(6, empty) // postback
_pack.set(10, packLimits)
_pack.set(11, packLimitsO)

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
 * @function packQueryWinImp
 * @description packs passed numbers to buffer
 * @param {number} type - max 255
 * @param {number} id - max 65535
 * @param {number} bid - max 65535
 * @param {number} price - max 655.35
 * @returns {object} - buffer 7 byte length
 * */

function packQueryWinImp (type, id, bid, price) {
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
 * @returns {object} - buffer
 * */

function packLimits (type, arr, validTo) {
  const head = Buffer.alloc(9)
  const buf = Buffer.alloc(arr.length * 2)
  head.writeUInt8(type, 0)
  head.writeDoubleLE(validTo, 1)

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
 * @param {object} obj - quotes each key or value can not be above 65535
 * @returns {object} - buffer
 * */

function packLimitsO (type, arr, validTo, obj) {
  const limits = packLimits(...arguments).slice(1)
  const l = limits.byteLength

  const head = Buffer.alloc(3)
  head.writeUInt8(type, 0)
  head.writeUInt16LE(l, 1)

  const keys = Object.keys(obj)
  const body = Buffer.alloc(keys.length * 4)

  for (let i = 0; i < keys.length; i++) {
    body.writeUInt16LE(+keys[i], i * 4)
    body.writeUInt16LE(obj[keys[i]], i * 2 + 2)
  }

  return Buffer.concat([head, limits, body])
}
