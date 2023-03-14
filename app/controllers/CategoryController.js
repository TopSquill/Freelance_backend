const { Category, Tag } = require('../models');
const { showError } = require('../utils/function/common');

class CategoryController {
  async getAllCategory(req, res) {
    try {
      const categories = await Category.findAll();

      res.status(200).send({ categories })
    } catch(err) {
      res.status(400).send({ message: 'Something went wrong' });
    }
  }

  async getCategoryInfo(req, res) {
    const { categoryId } = req.body;

    try {
      const category = await Category.findOne({ id: categoryId, include: { model: Tag, as: 'tags' }});

      res.status(200).send({ category })
    } catch (err) {
      res.status(400).send({ message: 'Something went wrong' })
    }
    
  }

  async create(req, res) {
    const { title, tags = [] } = req.body;

    try {
      const category = await Category.create({
        title,
        tags: tags.map(tag => ({ title: tag }))
      }, {
        include: {
          model: Tag,
          as: 'tags',
        }
      });

      return res.status(201).send({ success: true, category });
    } catch (err) {
      return res.status(400).send({ message: showError(err) })
    }
  }

  async update(req, res) {
    try {
      const { categoryId } = req.params;
      const { title } = req.body;

      await Category.update({ title }, { where: { id: categoryId }});
      return res.status(200).send({ success: true });
    } catch (err) {
      return res.status(400).send({ success: false, message: err.message })
    }
  }

  async deleteCategory(req, res) {
    const { categoryId } = req.params;

    try {
      await Category.destroy();
      return res.status(200).send({ success: true });
    } catch (err) {
      return res.status(400).send({ success: false, message: err.message })
    }
  }
}

module.exports = new CategoryController();
