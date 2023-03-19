const router = require('express').Router();
const ProjectController = require('../controllers/ProjectController');

// router.get('/', ProjectController.getProjects);
router.get('/', ProjectController.getAllProjects);
router.get('/:projectId', ProjectController.getProject);
router.post('/', ProjectController.createProject);
router.put('/:projectId', ProjectController.updateProject);

module.exports = router