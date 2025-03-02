const express = require('express');
const app = express(); 
const fs = require('fs');

let waterAmount;
let soilComposition;
let year;

fs.readFile('data/marsSample.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

   const marsData = JSON.parse(data);

   global.waterAmount = marsData.Water;
   global.soilComposition = marsData["Soil Composition"];
   global.year = marsData.Year;
 
   console.log(`Water Amount: ${global.waterAmount} ml\n`);
   console.log("Soil Composition:");
   for (const gas in global.soilComposition) {
       console.log(`${gas}: ${global.soilComposition[gas]}`);
   }
   console.log(`\nYear: ${global.year}\n`);
});