const { Project } = require("../models");
const { getUserId } = require("../utils/function/user");

const ProjectController = {
  createProject: (req, res) => {
    const { title, duration, description, attachments, budget, budgetType } = req.body

    try {
      const newProject = Project.build({ title, description, duration, attachments, budget, budgetType });
      newProject.postedByUserId = getUserId();
      res.status(201).send({ message: 'created' })
    } catch (err) {
      console.log('Update error', err.message);
      res.status(400).send(err.message);
    }
  },
  updateProject: (req, res) => {
    const { projectId, title, duration, description, attachments, budget, budgetType } = req.body

    try {
      const project = Project.update({ title, description, duration, attachments, budget, budgetType }, { where: { id: projectId }});
      res.status(201).send({ project })
    } catch (err) {
      console.log('Update error', err.message);
      res.status(400).send(err.message);
    }
  }
}

module.exports = ProjectController;
