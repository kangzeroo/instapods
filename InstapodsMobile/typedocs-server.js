const express = require('express')
const app = express()
const port = 2748

app.use(express.static('docs'))
app.listen(port)
console.log(`Documentation available at http://localhost:${port}`)
