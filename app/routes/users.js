const router = require('express').Router();
const UserController = require('../controllers/UserController');

router.post('/signup', UserController.signup);
// router.get('/projects', UserController.getAllProjects);
router.get('/verify-email/:token', UserController.verifyEmail);
router.post('/verify-email/resend', UserController.resendVerificationMail);
router.post('/login', UserController.login);


module.exports = router;