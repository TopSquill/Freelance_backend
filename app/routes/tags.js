// import all controllers
const router = require('express').Router();
const TagController = require('../controllers/TagController');
const authMiddleware = require('../middlewares');
const UserTypes = require('../utils/constants/UserTypes');

// Add router
// router.get('/', SessionController.store);
router.post('/', authMiddleware([UserTypes.CLIENT, UserTypes.FREELANCER, UserTypes.VENDOR]), TagController.create);
router.put('/:tagId', authMiddleware([UserTypes.CLIENT, UserTypes.FREELANCER, UserTypes.VENDOR]), TagController.update);
router.delete('/:tagId', authMiddleware([UserTypes.CLIENT, UserTypes.FREELANCER, UserTypes.VENDOR]), TagController.delete);

module.exports = router;
