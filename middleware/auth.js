const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  //middleware function will have access to request and response cycle, next will allow proj to move on to next piece of middleware
  //Get token from header
  const token = req.header('x-auth-token'); //when we send a req from a protected route, need to send the header

  //Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(410).json({ msg: 'Token is not valid ' });
  }
};
