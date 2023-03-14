// import all controllers
const router = require('express').Router();
const TagController = require('../controllers/TagController');

// Add router
// router.get('/', SessionController.store);
router.post('/', TagController.create);
router.put('/:tagId', TagController.update);
router.delete('/:tagId', TagController.delete);

module.exports = router;
