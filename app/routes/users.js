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
router.put('/freelancer/update', authMiddleware([UserTypes.FREELANCER, UserTypes.VENDOR, UserTypes.CLIENT]), FreelanceProfileController.update)
router.put('/', authMiddleware([UserTypes.FREELANCER, UserTypes.VENDOR, UserTypes.CLIENT]), UserController.updateProfile)
router.get('/freelancer-profile', authMiddleware([UserTypes.FREELANCER, UserTypes.VENDOR, UserTypes.CLIENT]), UserController.getUserWithFreelanceProfile)
module.exports = router;
