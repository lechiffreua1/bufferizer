'use strict'

const _unpack = new Map()

_unpack.set(0, unpackQueryWinImp)
_unpack.set(1, unpackBid)
_unpack.set(2, unpackQueryWinImp)
_unpack.set(3, unpackQueryWinImp)

module.exports = {
  _unpack
}

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
