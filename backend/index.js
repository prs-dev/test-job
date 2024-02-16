const express = require('express')

const app = express()

const fs = require('fs')
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    const data = fs.readFileSync('./data.json');
      res.status(200).json(JSON.parse(data))
})

app.post('/', (req, res) => {
    const data = req.body
    const jsonData = JSON.stringify(data);
    fs.writeFile('data.json', jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file exported successfully!');
      }
    });
    res.status(200).json('file written successfully')
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})