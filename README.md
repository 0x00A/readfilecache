# SYNOPSIS
Returns data from fs.readFile or memory conditional on the mtime from an fs.stat.

# USAGE
```js
// create a cache instance
var cache = require('reafilecache')()

// read a file
cache.readFile(filename, function(err, data, stat) {
	returns the data from the file and the stat info
})

// clear the cache
cache.invalidate()
```
