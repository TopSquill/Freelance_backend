const router = require('express').Router();
const UserController = require('../controllers/UserController');
const ProjectController = require('../controllers/ProjectController');

router.post('/signup', UserController.signup);
router.get('/posted-projects', ProjectController.getPostedProjects);
router.get('/verify-email/:token', UserController.verifyEmail);
router.post('/verify-email/resend', UserController.resendVerificationMail);
router.post('/login', UserController.login);


module.exports = router;