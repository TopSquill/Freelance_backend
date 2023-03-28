const router = require('express').Router();
const FreelanceProfileController = require('../controllers/FreelanceProfileController');

router.get('/', FreelanceProfileController.getAllFreelancers);

module.exports = router;
