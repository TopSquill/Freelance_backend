const { UnauthorizedError } = require("../utils/errors/users")
const { getUser } = require("../utils/function/user")

const authMiddleware = (roles) => {
    return (req, res, next) => {
        try {
            const user = getUser(req)
        } catch (err) {
            return res.status(401).send({ message: err.message });
        }

        if (Array.isArray(roles) && roles.includes(user?.userType)) {
            req.user = user;
            next();
        } else {
            return res.status(401).send({ message: 'Unauthorized' });
        }
    }
}

module.exports = authMiddleware;
