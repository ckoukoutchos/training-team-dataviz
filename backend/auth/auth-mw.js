/**
 * Simple middleware which checks for an access token
 * on the request.
 */
module.exports = function (req, res, next) {
    let token = req.headers['x-access-token'];
    if (token) {
		next();
    } else {
        res.status(401).send('No token provided in request!');
    }
};
