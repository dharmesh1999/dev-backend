const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')


//@route POST api/users
//@desc  Test route
//@access Public
router.post(
  '/',
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter valid email'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('must be at least 5 chars long')
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      //See if user exist
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({
          errors: [{ msg: 'User already exists' }]
        })
      }
      //Get user gravatar
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })

      user = new User({
        name,
        email,
        avatar,
        password
      })
      //Encrept password

      const salt = await bcrypt.genSalt(10)

      user.password = await bcrypt.hash(password, salt)

      await user.save()

      //return Jsonweb token
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err
          }
          res.json({ token })
        }
      )
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
