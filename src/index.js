global.Promise = require('bluebird')
const cors = require('cors')
const path = require('path')
const {json, urlencoded} = require('body-parser')
const express = require('express')
const app = express()
const {API_URI} = require('./constants')
const db = require('./db')
const {api} = require('./routers')

app.set('db', db)

if (app.get('env') !== 'testing') {
  const logger = require('morgan')
  app.use(logger('dev'))
}

if (app.get('env') === 'production') {
  const helmet = require('helmet')
  app.use(helmet())
}

app.use(cors())
app.use(json())
app.use(urlencoded({extended: false}))
app.use(API_URI, api)

app.use(express.static(path.join(__dirname, 'public/app')))

module.exports = app
