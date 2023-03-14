const { Project, ProjectCategory, ProjectTag } = require("../models");
const UserTypes = require("../utils/constants/UserTypes");
const { showError } = require("../utils/function/common");
const { getUserId, getUser } = require("../utils/function/user");

const ProjectController = {
  createProject: async (req, res) => {
    const { headline, duration, description, attachments, budget, budgetType, budgetCurrency, projectCategoryIds, projectTagIds = [] } = req.body
    const user = getUser(req);

    // if (user.userType !== UserTypes.CLIENT) {
    //   return res.status(405).send({ message: 'User type not allowed' })
    // }

    try {
      const newProject = await Project.create({ headline, description, duration, attachments, budget, budgetType, budgetCurrency, postedByUserId: user.id });

      await Promise.all([
        ProjectCategory.bulkCreate(projectCategoryIds.map(categoryId => ({ categoryId, projectId: newProject.id }))),
        ProjectTag.bulkCreate(projectTagIds.map(tagId => ({ tagId, projectId: newProject.id })))
      ]).then((success) => {
        console.log('asdasda--------------', success)
      })

      res.status(201).send({ message: 'created', project: newProject })
    } catch (err) {
      console.log('Create error', err.message);
      res.status(400).send({ message: showError(err) });
    }
  },
  updateProject: async (req, res) => {
    const { projectId } = req.params;
    const { headline, duration, description, attachments, budget, budgetType } = req.body;
    const user = getUser(req);
    if (user.userType !== UserTypes.CLIENT) {
      return res.status(405).send({ message: 'User type not allowed' })
    }

    try {
      const project = await Project.update({ headline, description, duration, attachments, budget, budgetType }, { where: { id: projectId }, returning: true });
      res.status(200).send({ project })
    } catch (err) {
      console.log('Update error', err.message);
      res.status(400).send({ message: err.message });
    }
  }
}

module.exports = ProjectController;
