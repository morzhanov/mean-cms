const {SC, SALT} = require('../constants')
const jwt = require('jsonwebtoken')

/**
 * Middleware to check jsonwebtokens
 * @param req - request object
 * @param res - response object
 * @param next - next middleware
 */
module.exports = function (req, res, next) {

  // check header or url params or post params for token
  var token = req.body.access_token ||
    req.query.access_token ||
    req.param('access_token') ||
    req.headers['x-access-token']

  // decode token
  if (token) {

    console.log('token is available')

    // verify secret and checks exp
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.status(403).send(
          {
            success: false,
            message: 'Failed to authenticate token.'
          })
      }
      else {

        // if everything is good, save to request for use in other routes
        req.decoded = decoded
        next()
      }
    })
  }

  else
  // if there is no token
  // return an HTTP response of 403 (access forbidden) and an error message
  {
    return res.status(403).send(
      {
        success: false,
        message: 'No token provided.'
      })
  }

}
