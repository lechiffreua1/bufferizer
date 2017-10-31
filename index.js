'use strict'

const { _pack } = require('./library/pack')
const { _unpack } = require('./library/unpack')

module.exports = {
  pack,
  unpack
}

/**
 * @function pack
 * @description packs passed arguments to buffer
 * @param {number} type - max 255
 * @param {*} args -
 * @returns {object} - buffer
 * */

function pack (type, ...args) {
  return _pack.get(type)(type, ...args)
}

/**
 * @function unpack
 * @description unpacks data from buffer
 * @param {object} buf -
 * @returns {*} -
 * */

function unpack (buf) {
  return _unpack.get(buf.readUInt8(0))(buf)
}
