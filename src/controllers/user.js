const MevicsError = require('../error/mevics-error')
const User = require('../models/user.js')
const {SECRET} = require('../constants/index')
const fs = require('fs')
const formidable = require('formidable')
const jwt = require('jsonwebtoken')

module.exports = {

  createUser: async ({body}, res, next) => {
    // create new instance of User model
    let user = new User()

    // set the user information (comes from request)
    user.name = body.name
    user.surname = body.surname
    user.email = body.email
    user.site = body.site
    user.password = body.password

    user.token = jwt.sign(
      {
        name: user.name,
        surname: user.surname,
        email: user.email
      }, SECRET, {
        expiresInMinutes: 1440
      })

    // save the user and check for errors
    try {
      user = await user.save()
    } catch (e) {
      return next(e)
    }

    if (!user) {
      return next(new MevicsError('User not saved'))
    }

    res.json({message: 'User created!'})
  },

  getUsers: async (req, res, next) => {
    let users
    try {
      users = await User.find()
    } catch (e) {
      return next(e)
    }

    if (!users) {
      return next(new MevicsError('Users not found'))
    }

    res.json(users)
  },

  getUser: async ({params}, res, next) => {
    let user
    try {
      user = await User.findById(params.id)
    } catch (e) {
      return next(e)
    }

    if (!user) {
      return next(new MevicsError('Users not found'))
    }

    user.password = null

    res.json(user)
  },

  updateUser: async ({params, body}, res, next) => {
    let user
    try {
      user = await User.findById(params.id)
    } catch (e) {
      return next(e)
    }

    if (!user) {
      return next(new MevicsError('Users not found'))
    }

    // update the users info only if its new
    if (body.name) user.name = body.name
    if (body.surname) user.surname = body.surname
    if (body.email) user.email = body.email
    if (body.site) user.site = body.site
    if (body.password) user.password = body.password

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
        success: true,
        message: 'User updated!',
        token: user.token,
        userData: {
          id: user._id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          site: user.site
        }
      })
  },

  deleteUser: async ({params}, res, next) => {
    try {
      await User.remove({_id: params.id})
    } catch (e) {
      next(e)
    }

    res.status(200).send()
  },

  uploadUserPhoto: async (req, res, next) => {
    let form = new formidable.IncomingForm()

    try {
      form = await form.parse(req)
      if (!form.fields || !form.files) {
        return next(new MevicsError('Form not parsed'))
      }
    } catch (e) {
      return next(e)
    }

    const photoData = form.fields['photo[data]']
    const imageType = form.fields['photo[type]']
    let user
    try {
      user = await User.findById(form.fields['photo[userId]'])
    } catch (e) {
      return next(e)
    }

    let photoPath
    try {
      photoPath = './public/assets/img/users-photos/' + user.email + imageType

      const base64Data = photoData.substring(photoData.indexOf(',') + 1)

      fs.writeFileSync(photoPath, base64Data, 'base64')
    } catch (e) {
      return next(e)
    }

    photoPath = 'assets/img/users-photos/' + user.username + imageType

    if (user.photo !== photoPath && user.photo !== undefined) {
      fs.unlinkSync(user.photo)
    }

    user.photo = photoPath

    try {
      user = await user.save()
    } catch (e) {
      return next(e)
    }

    if (!user) {
      return next(new MevicsError('User not saved'))
    }

    res.status(200).send()
  }
}
