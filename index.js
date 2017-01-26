'use strict'

const Transform = require('stream').Transform
const merge = require('merge-stream')
const duplexer2 = require('duplexer2')

const pkg = require('./package')

/**
 * Returns a transform stream which forks and merges the input stream with the given branching function.
 * @param {Object} options The options
 * @param {Function} func The branch description function
 * @return {Transform}
 */
const branch = (options, func) => {
  if (typeof func === 'undefined') {
    func = options
    options = {}
  }

  if (typeof func !== 'function') {
    throw new Error(`The branch description function should be a function\nSee ${pkg.homepage}`)
  }

  const input = new Transform(Object.assign({
    transform (chunk, enc, cb) { cb(null, chunk) }   
  }, options))

  const branches = func(input)

  if (!Array.isArray(branches)) {
    throw new Error(`The branch description function should return an array of readable streams\nSee ${pkg.homepage}`)
  }

  return duplexer2(options, input, merge(branches))
}

const obj = (options, func) => {
  if (typeof func === 'undefined') {
    func = options
    options = {}
  }

  options.objectMode = options.objectMode || true
  options.highWaterMark = options.highWaterMark || 16

  return branch(options, func)
}

module.exports = branch
module.exports.obj = obj
