const router = require('express').Router();
const UserController = require('../controllers/UserController');
const ProjectController = require('../controllers/ProjectController');
const FreelanceProfileController = require('../controllers/FreelanceProfileController');

router.post('/signup', UserController.signup);
router.get('/posted-projects', ProjectController.getPostedProjects);
router.post('/verify-email/resend', UserController.resendVerificationMail);
router.post('/verify-email/:token', UserController.verifyEmail);
router.post('/login', UserController.login);
router.post('/freelancer/create', FreelanceProfileController.create)
router.put('/freelancer/update', FreelanceProfileController.update)

module.exports = router;