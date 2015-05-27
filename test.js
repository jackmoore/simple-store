const isStream = require('is-stream')
const through = require('through2')
const test = require('tape')
const store = require('./index')

test('should return null on init', function (t) {
  t.plan(1)
  const s = store('hello')
  t.equal(s(), null)
})

test('should store a value', function (t) {
  t.plan(1)
  const s = store('derp')
  s('hello')
  t.equal(s(), 'hello')
})

test('should emit a data event on set()', function (t) {
  t.plan(1)
  const s = store()
  s.on('data', function (val) {
    t.equal(val, 'hello')
  })
  s('hello')
})

test('should expose aliases', function (t) {
  t.plan(2)
  const s = store()
  t.equal(s, s.set)
  t.equal(s(), s.get())
})

test('should expose a readable stream', function (t) {
  t.plan(2)
  const s = store()
  const str = s.createReadStream()
  t.ok(isStream(str), 'is stream')
  str.pipe(through(function (chunk, enc, cb) {
    console.log('chunk', chunk.toString())
    cb()
  }))

  s('hello')
})
