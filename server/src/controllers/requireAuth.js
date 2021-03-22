const sessionManager = require('../sessionManager.js');


const requireAuth = (req, res, next) => {
    const user = sessionManager.getUser(req.session.authToken);

    if (!user) {
        res.status(401).send('Unauthorized. Please make sure you are logged in before attempting this action again.');
        return;
    }
    next();
};

module.exports = requireAuth;
