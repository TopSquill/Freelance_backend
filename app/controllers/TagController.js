const { Tag } = require('../models');

class TagController {
  async create(req, res) {
    const { title, categoryId } = req.body;
    try {
      const tag = await Tag.create({ title, categoryId });

      return res.status(201).send({ success: true, tag });
    } catch(err) {
      return res.status(400, { message: err.message });
    }
  }

  async update(req, res) {
    const { tagId } = req.params;
    const { title } = req.body;

    try {
      await Tag.update({ title }, { where: { id: tagId }});

      return res.status(201).send({ success: true });
    } catch(err) {
      return res.status(400, { message: err.message });
    }
  }

  async delete(req, res) {
    const { tagId } = req.params;

    try {
      await Tag.destroy({ where: { id: tagId }});

      return res.status(201).send({ success: true });
    } catch(err) {
      return res.status(400, { message: err.message });
    }
  }
}

module.exports = new TagController();
