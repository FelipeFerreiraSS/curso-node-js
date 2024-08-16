const express = require('express')
const app = express()
const port = 3000

const path = require("path")

const users = require('./users')

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(express.json())

app.use(express.static('public'))

const basePath = path.join(__dirname, 'templates')

app.use('/users', users)

app.get('/', (req, res) => {
  res.sendFile(`${basePath}/index.html`)
})

app.listen(port, () => {
  console.log(`Server rodando na porta: ${port}`);
})

// const checkAuth = function (req, res, next) {
//   req.authStatus = true

//   if (req.authStatus) {
//     console.log('Esta logado, pode continuar');
//     next()
//   } else {
//     console.log('Não está logado, faça login para continuar');
//     next()
//   }
// }

//app.use(checkAuth)


