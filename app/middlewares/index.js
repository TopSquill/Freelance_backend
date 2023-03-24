const { getUser } = require("../utils/function/user")

const authMiddleware = (roles) => {
    return (req, res, next) => {
        const user = getUser(req)
        if (Array.isArray(roles) && roles.includes(user?.userType)) {
            req.user = user;
            next();
        } else {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    }
}

module.exports = authMiddleware;
