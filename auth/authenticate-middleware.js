const jwt = require('jsonwebtoken')

module.exports = { regValid, loginValid }

const roles = [
    'normal',
    'admin'
]

function regValid(req, res, next) {
  if(req.body && req.body.username && req.body.password) {
    next()
  } else {
    res.status(400).json({message: 'Username or Password not entered'})
  }
}

function loginValid(role) {
  return async (req, res, next) => {
    const authErr = {
      message: 'Invalid credentials'
    }

    try {
      const token = req.headers.authorization
      if (!token) {
        return res.status(400).json(authErr)
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
          return res.status(400).json(authErr)
        }
        if (role && roles.indexOf(decoded.userRole) < roles.indexOf(role)) {
          return res.status(400).json(authErr)
        }
        next()
      })
    } catch (e) {
      next(e)
    }
  }
}


