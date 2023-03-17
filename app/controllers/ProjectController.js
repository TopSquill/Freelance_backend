const { Project, ProjectCategory, ProjectTag, sequelize, Sequelize, User, Category, Tag } = require("../models");
const UserTypes = require("../utils/constants/UserTypes");
const { UnauthorizedError } = require("../utils/errors/users");
const { showError } = require("../utils/function/common");
const { getUserId, getUser } = require("../utils/function/user");
const { Transaction, Association } = require('sequelize');

const ProjectController = {
  getProjects: async (req, res) => {
    try {
      const user = getUser(req);
      const projects = await user.getProjects();

      return res.status(200).send({ projects });
    } catch (err) {
      return res.status(400).send({ message: showError(err) });
    }
  },
  getProject: async (req, res) => {
    const { projectId } = req.params;

    try {
      const project = await Project.findOne({ where: { id: projectId }, include: [{ model: Tag, as: 'keywords' }] });

      return res.status(200).send({ project });
    } catch (err) {
      return res.status(400).send({ message: showError(err) });
    }
  },
  createProject: async (req, res) => {
    const { headline, duration, description, attachments, budget, budgetType, budgetCurrency, projectCategoryIds, projectTagIds = [] } = req.body
    let newProject;


    try {
      const user = getUser(req);

      await sequelize.transaction(async (t) => {
        newProject = await Project.create({ headline, description, duration, attachments, budget, budgetType, budgetCurrency, postedByUserId: user.id }, { transaction: t });

        await Promise.all([
          ProjectCategory.bulkCreateRaw([newProject.id], projectCategoryIds, {
            transaction: t
          }),
          // ProjectCategory.bulkCreate(
          //   projectCategoryIds?.map(categoryId => ({ categoryId, projectId: newProject.id })),
          //   {
          //     returning: true,
          //     transaction: t,
          //     omitNull: true
          //   }
          // ),
          ProjectTag.bulkCreateRaw([newProject.id], projectTagIds, {
            transaction: t,
          })
        ]).then((success) => {
          console.log('success insert join table--------------', success)
        }).catch(err => {
          console.log('error in join table', err)
          throw err;
        })

      })

      return res.status(201).send({ message: 'created', project: newProject })
    } catch (err) {
      console.log('Create error', err.message);
      if (err instanceof UnauthorizedError) {
        return res.status(400).send({ message: showError(err) });
      }
      return res.status(400).send({ message: showError(err) });
    }
  },
  updateProject: async (req, res) => {
    const { projectId } = req.params;
    // Categories cannot be changed right now
    const { headline, duration, description, attachments, budget, budgetType, currenTagIds, updatedTagIds } = req.body;
    let project;

    const newTagIds = updatedTagIds?.filter(updatedTagId => !currenTagIds.includes(updatedTagId))
    const deletedTagIds = currenTagIds?.filter(updatedTagId => !updatedTagIds.includes(updatedTagId))

    try {
      await sequelize.transaction(async (t) => {
        const user = getUser(req);
        // if (user.userType !== UserTypes.CLIENT) {
        //   return res.status(405).send({ message: 'User type not allowed' })
        // }

        project = await Project.update({ headline, description, duration, attachments, budget, budgetType }, { where: { id: projectId }, returning: true });
        
        Promise.all([
          ProjectTag.destroy({ where: deletedTagIds }, { transaction: t }),
          ProjectTag.bulkCreateRaw([project.id], newTagIds, { transaction: t })
        ]).catch(err => {
          throw err;
        })
      })

      res.status(200).send({ project })
    } catch (err) {
      console.log('Update error', err.message);
      res.status(400).send({ message: err.message });
    }
  }
}

module.exports = ProjectController;
