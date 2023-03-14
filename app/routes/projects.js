const router = require('express').Router();
const ProjectController = require('../controllers/ProjectController');


router.post('/', ProjectController.createProject);
router.put('/:projectId/', ProjectController.updateProject);

module.exports = router