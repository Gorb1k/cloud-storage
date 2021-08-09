const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return  next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: 'Auth error'})
        }
        const decodedToken = jwt.decode(token, config.get('secretKey'))
        req.user = decodedToken
        next()
    }catch (e) {
        return res.status(401).json({message: 'Auth error'})

    }
}