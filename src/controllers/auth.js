const User = require('../models/user.js')
const MevicsError = require('../error/mevics-error')
const {SECRET} = require('../constants/index')
const jwt = require('jsonwebtoken')

module.exports = {
  login: async ({body}, res, next) => {
    // find the user
    let user
    try {
      user = await User.findOne({email: body.user.email})
    } catch (e) {
      return next(e)
    }

    // no user with that username was found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found'
      })
    }

    if (!user.comparePassword(user.password)) {
      res.json(
        {
          success: false,
          message: 'Authentication failed. Wrong password.'
        })
    }
    // if user is found and password is right
    // create a token
    const token = jwt.sign(
      {
        name: user.name,
        surname: user.surname,
        email: user.email
      }, SECRET, {
        expiresInMinutes: 1440
      })

    try {
      user = await user.save()
    } catch (e) {
      return next(e)
    }

    if (!user) {
      return next(new MevicsError('User not saved'))
    }

    // return the information including token as JSON
    res.json(
      {
        success: true,
        message: 'Enjoy your token!',
        token: token,
        userData: {
          id: user._id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          site: user.site
        }
      })
  },

  signup: async ({body}, res, next) => {
    // create new instance of User model
    let user = new User()

    // set the user information (comes from request)
    user.name = body.user.name
    user.surname = body.user.surname
    user.email = body.user.email
    user.site = body.user.site
    user.password = body.user.password

    user.token = jwt.sign(
      {
        name: user.name,
        surname: user.surname,
        email: user.email
      }, SECRET, {
        expiresInMinutes: 1440
      })

    try {
      user = await user.save()
    } catch (e) {
      return next(e)
    }

    if (!user) {
      return next(new MevicsError('User not saved'))
    }

    res.json(
      {
        message: 'User created!',
        userData: {
          id: user._id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          site: user.site
        }
      })
  }
}
