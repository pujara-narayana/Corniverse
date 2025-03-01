const express = require('express');
const app = express(); 
const fs = require('fs');

let temp;
let it;

app.use(express.urlencoded({extended:true}));

// Local host connection HTML
app.get('/', (req, res) => {

    fs.readFile('./home.html', 'utf8', (err, html) => {

        if (err) {
            response.status(500).send('Unavailable')
        }

        //response.send(html)
        res.send(`
            <form action="/submit" method="POST">
              <label for="temperature">Temperature:</label>
              <input type="text" id="temperature" name="temperature" required>
              <label for="item">Item:</label>
              <input type="text" id="item" name="item" required>
              <button type="submit">Submit</button>
            </form>
          `);

    })
})

// User input
app.post('/submit', (req, res) => {
    const { temperature, item } = req.body;
  
    if (!temperature || !item) {
      return res.status(400).send('Please try again.');
    }

    console.log(`Received temperature: ${temperature}, item: ${item}`);
  
    res.send(`Received ${temperature} and ${item}`);

    
  });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function store_earth_data(year, integer) {
    
}