const router = require('express').Router();
const UserController = require('../controllers/UserController');
const ProjectController = require('../controllers/ProjectController');
const FreelanceProfileController = require('../controllers/FreelanceProfileController');
const authMiddleware = require('../middlewares');
const UserTypes = require('../utils/constants/UserTypes');

router.post('/signup', UserController.signup);
router.get('/posted-projects', authMiddleware([UserTypes.CLIENT]), ProjectController.getPostedProjects);
router.post('/verify-email/resend', UserController.resendVerificationMail);
router.post('/verify-email/:token', UserController.verifyEmail);
router.post('/login', UserController.login);
router.post('/freelancer/create', authMiddleware([UserTypes.FREELANCER, UserTypes.VENDOR]), FreelanceProfileController.create)
router.put('/freelancer/update', authMiddleware([UserTypes.FREELANCER, UserTypes.VENDOR]), FreelanceProfileController.update)

module.exports = router;