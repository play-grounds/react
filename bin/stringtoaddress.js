#!/usr/local/bin/node

const base58check = require('base58check')
const crypto = require('crypto')
const secp256k1 = require('secp256k1')

/**
 * Gets sha256 string from a buffer
 *
 * @param {Buffer} buf - A buffer to be hashed
 * @returns {Buffer} A sha256 hash buffer of that string
 */
function sha256 (buf) {
  const sha256 = crypto.createHash('sha256')
  sha256.update(buf)
  return sha256.digest()
}

/**
 * Gets ripemd160 string from a buffer
 *
 * @param {Buffer} buf - A buffer to be hashed
 * @returns {Buffer} A ripemd160 hash buffer of that string
 */
function ripemd160 (buf) {
  const ripemd160 = crypto.createHash('ripemd160')
  ripemd160.update(buf)
  return ripemd160.digest()
}

/**
 * Gets an address from a string
 *
 * @param {string} str - A string that is a seed
 * @param {boolean} compressed - compressed on uncompressed
 * @returns {string} A bitcoin address
 */
function getAddress (str, compressed) {
  compressed = !!compressed
  var brain = str
  var brain_hash = sha256(Buffer.from(brain))
  const pubKey = secp256k1.publicKeyCreate(brain_hash, compressed)
  var ripemd160_digest = ripemd160(sha256(pubKey))
  var address = base58check.encode(ripemd160_digest)
  return address
}

// main
// usage getaddress.js <seed> [compressed]
var brain = process.argv[2] || 'a'
var compressed = !!process.argv[3]
var address = getAddress(brain, compressed)

console.log(address)
