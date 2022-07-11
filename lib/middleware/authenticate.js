const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    if (!cookie) throw new Error('You must be logged in to continue');
    const client = jwt.verify(cookie, process.env.JWT_SECRET);
    req.client = client;

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};
