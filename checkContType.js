module.exports = function (req, res, next) {
    
    if (req.is('application/json')) {
        return next()
    }
    res.status(400).send('Bad request');
}