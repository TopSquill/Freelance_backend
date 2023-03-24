const router = require('express').Router();
const userRouter = require('./users');
const projectRouter = require('./projects');
const categoriesRoutes = require('./categories');
const tagsRoutes = require('./tags');
const proposalRoutes = require('./proposals');

router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/categories', categoriesRoutes);
router.use('/tags', tagsRoutes);
router.use('/proposals', proposalRoutes);

module.exports = router;