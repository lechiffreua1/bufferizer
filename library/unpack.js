'use strict'

const _unpack = new Map()

_unpack.set(0, unpackQuery)
_unpack.set(1, unpackBid)
_unpack.set(2, unpackQueryWinImp)
_unpack.set(3, unpackQueryWinImp)
_unpack.set(4, empty) // click
_unpack.set(5, empty) // conversion
_unpack.set(6, empty) // postback
_unpack.set(10, unpackLimits)
_unpack.set(11, unpackLimitsO)

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
  const sub = buf.slice(9)

  for (let i = 0; i < sub.byteLength / 2; i++) {
    set.add(sub.readUInt16LE(i * 2))
  }

  return [buf.readUInt8(0), {
    data: Array.from(set),
    validTo: buf.readDoubleLE(1)
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

  return [...unpackLimits(limits), obj]
}
