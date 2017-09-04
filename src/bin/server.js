const http = require('http')
const app = require('../index')
const async = require('async')
const debug = require('debug')('main-server:server')
const signals = ['SIGINT', 'SIGTERM']
const {printIP} = require('../services/app-service')
const {PORT} = require('../constants')
const db = app.get('db')

// create https server
const server = http.createServer(app)

// listen server
server.listen(PORT)

// set listeners and error handlers
server.on('error', onError)
server.on('listening', onListening)

signals.forEach(function (signal) {
  process.once(signal, () => {
    debug(signal, ' happened!')
    async.waterfall([
      closeServer,
      closeDbConnection
    ], closeApp)
  })
})

/**
 * Closes app and depends on err exit it with 0 or 1 status
 * @param  {Error} err - passed error
 */
function closeApp (err) {
  debug('Now application will be closed!', err || '')
  err ? process.exit(1) : process.exit(0)
}

/**
 * Closes application server
 * @param  {Function} next - next passed callback
 */
function closeServer (next) {
  debug('Now server will be closed!')
  server.close(next)
}

/**
 * Closes db connection
 * @param  {Function} next - next passed callback
 */
function closeDbConnection (next) {
  debug('Now db will be closed!')
  db.close(next)
}

/**
 * Logging server info on listening
 */
function onListening () {
  const addr = server.address()
  debug(`Listening on port ${addr.port}`)
  printIP()
}

/**
 * Event listener for HTTP server "error" event.
 * @param  {Error} err - passed error
 */
function onError (err) {
  if (err.syscall !== 'listen') {
    throw err
  }

  switch (err.code) {
    case 'EACCES':
      debug(`Port ${PORT} requires elevated privileges`)
      return process.exit(1)
    case 'EADDRINUSE':
      debug(`Port ${PORT} is already in use`)
      return process.exit(1)
    default:
      throw err
  }
}
