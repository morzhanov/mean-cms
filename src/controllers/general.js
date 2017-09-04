const MevicsError = require('../error/mevics-error')
const User = require('../models/user.js')

module.exports = {
  dashboard: function (req, res) {
    res.json({message: 'To dashboard!'})
  },

  me: async function (req, res, next) {
    const user = await User.findOne({email: req.decoded.email})

    if (!user) {
      return next(new MevicsError('User not saved'))
    }

    res.json(user)
  }
}
