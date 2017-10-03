const model = require('./model.js')

model.sync().then(() => {
	console.log('init ok')
	process.exit(0)
}).catch((err) => {
	console.log(err)
	process.exit(0)
})