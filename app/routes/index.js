const router = require('express').Router();
const userRouter = require('./users');
const projectRouter = require('./projects');
const categoriesRoutes = require('./categories');
const tagsRoutes = require('./tags');


router.use('/users', userRouter);
router.use('/projects', projectRouter);
router.use('/categories', categoriesRoutes);
router.use('/tags', tagsRoutes);

module.exports = router;