const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController');


// Add routes
// router.get('/', SessionController.store);
router.post('/', CategoryController.create);
router.put('/:categoryId', CategoryController.update);
// router.delete('/', SessionController.store);

module.exports = router;
