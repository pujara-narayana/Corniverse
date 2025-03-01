const myModule = require('./my-module');
const {EventEmitter} = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('lunch', () => {
	console.log('something');
})

// Calling it
//eventEmitter.emit('lunch')

const { readFile } = require('fs').promises;

async function hello() {
    const file = await readFile('./text.txt', 'utf-8');
    console.log(file);
}

console.log(myModule)
