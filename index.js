'use strict'

module.exports = {
  pack,
  unpack
}

/**
 * @function pack
 * @description packs passed numbers to buffer
 * @param {number} type - max 255
 * @param {number} id - max 65535
 * @param {number} bid - max 65535
 * @param {number} price - max 655.35
 * @returns {object} - buffer 7 byte length
 * */

function pack (type, id, bid, price) {
  const buf = Buffer.alloc(7)
  buf.writeUInt8(type, 0)
  buf.writeUInt16LE(id, 1)
  buf.writeUInt16LE(bid, 3)
  buf.writeUInt16LE(parseInt(price * 100), 5)
  return buf
}

/**
 * @function unpack
 * @description unpacks numbers from buffer
 * @param {object} buf - 7 byte length buffer
 * @returns {object} - array
 * */

function unpack (buf) {
  return [
    buf.readUInt8(0),
    buf.readUInt16LE(1),
    buf.readUInt16LE(3),
    buf.readUInt16LE(5) / 100
  ]
}
