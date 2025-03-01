// const myModule = require('./my-module');
const express = require('express');
const app = express(); 
const fs = require('fs');
// const {EventEmitter} = require('events');
// const eventEmitter = new EventEmitter();

// eventEmitter.on('lunch', () => {
// 	console.log('something');
// })

// Calling it   
//eventEmitter.emit('lunch')

// const { readFile } = require('fs').promises;

// async function hello() {
//     const file = await readFile('./text.txt', 'utf-8');
//     console.log(file);
// }

app.get('/', (request, response) => {

    fs.readFile('./home.html', 'utf8', (err, html) => {

        if (err) {
            response.status(500).send('Unavailable')
        }

        response.send(html)

    })
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});