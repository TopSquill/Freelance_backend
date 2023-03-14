const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController');


// Add routes
router.get('/', CategoryController.getAllCategory);
router.get('/:categoryId', CategoryController.getCategoryInfo);
router.post('/', CategoryController.create);
router.put('/:categoryId', CategoryController.update);
router.delete('/:categoryId', CategoryController.deleteCategory);

module.exports = router;
