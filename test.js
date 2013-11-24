var cache = require('./index')()
var assert = require('better-assert')
var fs = require('fs')

var f = __dirname + '/test.js'
var l = console.log

cache.readFile(f, function(err, data, stat) {

	l('Assert file data is returned.')
	assert(!!data)
	l('Assert stat data is returned.')
	assert(!!stat)

	var atime = stat.atime
	var length = data.length

	setTimeout(function() {
		cache.readFile(f, function(err, data, stat) {
			l('Assert data of next read is exactly the same.')
			assert(data.length == length)
			l('Assert access time is the same as the last access time.')
			assert(atime == stat.atime)

			cache.invalidate()

			l('Assert cache can be invalidated.')
			assert(Object.keys(cache.cache).length === 0)

			l('Assert fresh copy has new atime.')
			cache.readFile(f, function(err, data, stat) {
				assert(atime != stat.atime)
				l('Finsihed.')
			})

		})
	}, 128)
})
