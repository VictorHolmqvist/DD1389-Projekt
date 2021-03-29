const sessionManager = require('../sessionManager.js');


const requireAuth = (req, res, next) => {
    if(!req.session.authToken) {
        res.status(401).send('Unauthorized. Please make sure you are logged in before attempting this action again.');
        return;
    }

    const user = sessionManager.getUser(req.session.authToken);

    if (!user) {
        res.status(401).send('Unauthorized. Please make sure you are logged in before attempting this action again.');
        return;
    }

    // Register the activity by this user, updates the timeout of the session.
    sessionManager.registerActivity(req.session.authToken, req);

    next();
};

module.exports = requireAuth;
