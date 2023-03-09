const ProjectController = require('../controllers/ProjectController');

const router = require('express').Router();

router.post('/', ProjectController.createProject);

module.exports = router