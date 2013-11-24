var fs = require('fs')

var readFileCache = module.exports = function readFileCache() {
  if (!(this instanceof readFileCache)) {
    return new readFileCache()
  }
  this.cache = {}
}

readFileCache.prototype.readFile = function stat(path, cb) {
  var that = this
  fs.stat(path, function(err, stat) {
    if (err) return cb(err)
    var f = that.cache[path]
    if (!f || !f.mtime || stat.mtime > f.mtime) {
      that.cache[path] = { mtime: stat.mtime, stat: stat }
      return that.fetch(path, cb)
    } 
    that.get(path, cb)
  })
}

readFileCache.prototype.readFileSync = function stat(path) {
  var stat = fs.statSync(path)
  var f = this.cache[path]
  if (!f || !f.mtime || stat.mtime > f.mtime) {
    this.cache[path] = { mtime: stat.mtime, stat: stat }
    return this.fetchSync(path)
  } 
  return this.getSync(path)
}

readFileCache.prototype.fetch = function fetch(path, enc, cb) {
  if (typeof enc == 'function') {
    cb = enc
    enc = 'utf8'
  }
  var that = this
  return fs.readFile(path, enc, function(err, data) {
    if (err) return cb(err)
    that.cache[path].data = data
    that.get(path, cb)
  })
}

readFileCache.prototype.fetchSync = function fetch(path, enc) {
  var data = fs.readFileSync(path, enc || 'utf8')
  this.cache[path].data = data
  return this.getSync(path)
}

readFileCache.prototype.get = function get(path, cb) {
  var f = this.cache[path]
  return cb(null, f.data, f.stat)
}

readFileCache.prototype.getSync = function get(path) {
  return this.cache[path].data
}

readFileCache.prototype.invalidate = function() {
  this.cache = {}
}
