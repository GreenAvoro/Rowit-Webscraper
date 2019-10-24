const express = require('express')
const scrape = require('./scrape')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    console.log("Getting root")
})

app.post("/api/scrape", scrape,  async (req, res) => {
    console.log("Getting scrapper")
    res.send(req.rowers)
})

const PORT = 5000 || process.env.PORT

app.listen(PORT)
console.log(`Listening on PORT: ${PORT}`)