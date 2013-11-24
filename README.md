# SYNOPSIS
Returns data from fs.readFile or memory conditional on the mtime from an fs.stat.

# USAGE
```js
//
// create a cache instance
//
var cache = require('reafilecache')()

//
// read a file, a call to the same path will return 
// the data from memory if the mtime is the same
// on the file as it is in memory.
//

cache.readFile(filename, function(err, data, stat) {
  // returns the data from the file and the stat info
})

//
// supports a sync api as well
//
cache.readFileSync(filename) // returns the file

//
// clear the cache
//
cache.invalidate()
```
