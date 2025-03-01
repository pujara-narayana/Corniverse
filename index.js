const {EventEmitter} = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('lunch', () => {
	console.log('something')
})

// Calling it
eventEmitter.emit('lunch')