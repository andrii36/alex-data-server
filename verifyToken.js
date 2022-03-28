const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const token = req.header('authtoken')
    if(!token) return res.status(401).send('Access Denied')

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch(err){
        res.json({code: 1, message: "You are not authorized"})
    }
}