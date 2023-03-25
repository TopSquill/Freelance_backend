const router = require('express').Router();
const ProjectController = require('../controllers/ProjectController');
const authMiddleware = require('../middlewares');
const UserTypes = require('../utils/constants/UserTypes');

// router.get('/', ProjectController.getProjects);
router.get('/', ProjectController.getAllProjects);
router.get('/:projectId', ProjectController.getProject);
router.post('/', authMiddleware([UserTypes.CLIENT]), ProjectController.createProject);
router.post('/:projectId/assign', ProjectController.assignProject);
router.put('/:projectId', authMiddleware([UserTypes.CLIENT]), ProjectController.updateProject);

module.exports = router