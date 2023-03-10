const { Project } = require("../models");
const UserTypes = require("../utils/constants/UserTypes");
const { getUserId, getUser } = require("../utils/function/user");

const ProjectController = {
  createProject: async (req, res) => {
    const { headline, duration, description, attachments, budget, budgetType } = req.body
    const user = getUser(req);
    if (user.userType !== UserTypes.CLIENT) {
      return res.status(405).send({ message: 'User type not allowed' })
    }

    try {
      const newProject = Project.build({ headline, description, duration, attachments, budget, budgetType });
      newProject.postedByUserId = user.id;
      const obj = await newProject.save()
      res.status(201).send({ message: 'created', project: obj })
    } catch (err) {
      console.log('Create error', err.message);
      res.status(400).send({ message: err.message });
    }
  },
  updateProject: (req, res) => {
    const { projectId } = req.params;
    const { headline, duration, description, attachments, budget, budgetType } = req.body;
    const user = getUser(req);
    if (user.userType !== UserTypes.CLIENT) {
      return res.status(405).send({ message: 'User type not allowed' })
    }

    try {
      const project = Project.update({ headline, description, duration, attachments, budget, budgetType }, { where: { id: projectId }});
      res.status(200).send({ project })
    } catch (err) {
      console.log('Update error', err.message);
      res.status(400).send({ message: err.message });
    }
  }
}

module.exports = ProjectController;
