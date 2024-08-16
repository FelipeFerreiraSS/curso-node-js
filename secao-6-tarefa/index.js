const express = require('express')
const app = express()
const port = 5000

const path = require("path")

const users = require('./users')

const products = require('./products')

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(express.json())

app.use(express.static('public'))

const basePath = path.join(__dirname, 'templates')

app.use('/users', users)

app.use('/products', products)

app.get('/', (req, res) => {
  res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
  console.log(`Server rodando na porta: ${port}`);
})

