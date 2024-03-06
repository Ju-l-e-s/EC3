const UnauthorizedError = require('../errors/unauthorized');
const jwt = require('jsonwebtoken');
const config = require('../config');
const usersService = require('../api/users/users.service');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      throw 'not token';
    }
    const decoded = jwt.verify(token, config.secretJwtToken);

    if (process.env.NODE_ENV === 'test') {
      // en mode test, pas de requête à la base de données
      req.user = decoded;
    } else {
      // en mode production, requête à la base de données
      const user = await usersService.get(decoded.userId);
      req.user = user;
    }
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
