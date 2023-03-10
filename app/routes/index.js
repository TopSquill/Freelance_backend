const router = require('express').Router();
const userRouter = require('./users');
const projectRouter = require('./projects');

router.use('/users', userRouter);
router.use('/projects', projectRouter);

module.exports = router;