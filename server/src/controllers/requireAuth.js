const sessionManager = require('../sessionManager.js');
const socketManager = require('../socketManager.js');

const requireAuth = (req, res, next) => {
  if (!req.session.authToken) {
    res.status(401).send('Unauthorized. Please make sure you are logged in before attempting this action again.');
    return;
  }

  const exp = req.session.expiration;
  if (!exp || exp < Date.now()) {
    sessionManager.invalidateUser(req.session.authToken, req);
    res.status(401).send('Unauthorized. Session has expired.');
    return;
  }

  const user = sessionManager.getUser(req.session.authToken);

  if (!user) {
    res.status(401).send('Unauthorized. Please make sure you are logged in before attempting this action again.');
    return;
  }

  // Register the activity by this user, updates the timeout of the session.
  req.session.expiration = Date.now() + 30000;
  socketManager.updateExpirationTime(req.session.authToken, Date.now() + 30000);

  req.session.save((err) => {
    if (err) {
      console.error(`Failed updating session expiry time: ${err}`);
    }
  });

  next();
};

module.exports = requireAuth;
