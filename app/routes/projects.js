const ProjectController = require('../controllers/ProjectController');

const router = require('express').Router();

router.post('/', ProjectController.createProject);
router.put('/:projectId/', ProjectController.updateProject);

module.exports = router