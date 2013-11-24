var fs = require('fs')

var readFileCache = module.exports = function readFileCache() {
  if (!(this instanceof readFileCache)) {
    return new readFileCache()
  }
  this.cache = {}
}

readFileCache.prototype.readFile = function stat(path, cb) {
  var that = this
  return fs.stat(path, function(err, stat) {
    if (err) return cb(err)
    var f = that.cache[path]
    if (!f || !f.mtime || stat.mtime > f.mtime) {
      that.cache[path] = { mtime: stat.mtime, stat: stat }
      that.fetch(path, cb)
    } 
    else {
      that.get(path, cb)
    }
  })
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

readFileCache.prototype.get = function get(path, cb) {
  var f = this.cache[path]
  return cb(null, f.data, f.stat)
}

readFileCache.prototype.invalidate = function() {
  this.cache = {}
}
