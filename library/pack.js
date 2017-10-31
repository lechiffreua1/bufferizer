'use strict'

const _pack = new Map()

_pack.set(0, packQuery)
_pack.set(1, packBid)
_pack.set(2, packQueryWinImp)
_pack.set(3, packQueryWinImp)

module.exports = {
  _pack
}

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
