const test = require('tape')
const Readable = require('stream').Readable
const through2 = require('through2')
const branch = require('./')

const stringify = obj => JSON.stringify(obj)

test('`branch` forks and merges the stream', t => {
  t.plan(4)

  const readable = new Readable({ read() {} })

  readable.pipe(branch(src => [src.pipe(through2((chunk, enc, cb) => {
    t.equal(chunk.toString(), 'hello')
    cb(null, 'foo')
  })), src.pipe(through2((chunk, enc, cb) => {
    t.equal(chunk.toString(), 'hello')
    cb(null, 'bar')
  }))])).on('data', chunk => {
    t.ok(chunk.toString() === 'bar' || chunk.toString() === 'foo')
  })

  readable.push('hello')
})

test('`branch` throws when the given func is not a function', t => {
  t.plan(1)

  t.throws(() => {
    branch(null)
  })
})

test('`branch throws when the given func does not return an array', t => {
  t.plan(3)

  t.throws(() => {
    branch(src => null)
  })

  t.throws(() => {
    branch(src => 'stream')
  })

  t.throws(() => {
    branch(src => new Readable())
  })
})

test('`branch.obj` creates a transform in object mode', t => {
  t.plan(4)

  const readable = new Readable({ objectMode: true, read() {} })

  readable.pipe(branch.obj(src => [src.pipe(through2.obj((chunk, enc, cb) => {
    t.deepEqual(chunk, { hello: 'world' })
    cb(null, { foo: 'bar' })
  })), src.pipe(through2.obj((chunk, enc, cb) => {
    t.deepEqual(chunk, { hello: 'world' })
    cb(null, { foo: 'baz' })
  }))])).on('data', chunk => {
    const a = stringify(chunk)
    t.ok(a === stringify({ foo: 'bar' }) || a === stringify({ foo: 'baz' }))
  })

  readable.push({ hello: 'world' })
})
