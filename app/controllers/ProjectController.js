const { Project, ProjectCategory, ProjectTag, sequelize, Sequelize, User, Category, Tag, Job } = require("../models");
const project = require("../models/project");
const JobStatus = require("../utils/constants/JobStatus");
const { UnauthorizedError } = require("../utils/errors/users");
const { showError } = require("../utils/function/common");

// const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const ProjectController = {
  getPostedProjects: async (req, res) => {
    try {
      const user = req.user;

      if (user) {
        const projects = await Project.findAll({ where: {
            postedByUserId: user.id
          } 
        })
        return res.status(200).send({ projects });
      }


    } catch (err) {
      return res.status(400).send({ message: showError(err) });
    }
  },
  getAllProjects: async (req, res) => {
    const { search } = req.query;
    let filter;
    if (req.query.filter) {
      try {
        filter = JSON.parse(req.query.filter);
      } catch(err) {
        return res.send(400).send({ message: 'invalid filter param'})
      }
    }

    const { tags, budgetType, budgetRange } = filter || { tags: [], budgetType: [], budgetRange: {} };
    if (budgetRange?.constructor?.name == 'Object' && !Object.keys(budgetRange).every(b => budgetType?.includes(b))) {
      return res.status(400).send({ message: 'budget range cannot be sent without budget type' });
    }
    // TODO: pagination has to be added
    try {
      const projects = await Project.getFilteredProject(search, tags, budgetType, budgetRange);
      return res.status(200).send({ projects });
    } catch (err) {
      return res.status(400).send({ message: showError(err) });
    }
  },
  getProject: async (req, res) => {
    const { projectId } = req.params;

    try {
      const project = await Project.findOne({ 
        where: { id: projectId }, 
        include: [{ 
          model: Tag, 
          as: 'keywords',
          through: {
            attributes: []
          }
        }] 
      });

      return res.status(200).send({ project });
    } catch (err) {
      console.log('err ------', err);
      return res.status(400).send({ message: showError(err) });
    }
  },
  createProject: async (req, res) => {
    const { headline, duration, description, attachments, budget, budgetType, budgetCurrency, projectCategoryIds, projectTagIds = [] } = req.body
    let newProject;


    try {
      const user = req.user;

      await sequelize.transaction(async (t) => {
        newProject = await Project.create({ headline, description, duration, attachments, budget, budgetType, budgetCurrency, postedByUserId: user.id }, { transaction: t });

        await Promise.all([
          ProjectCategory.bulkCreateRaw([newProject.id], projectCategoryIds, {
            transaction: t
          }),
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
        const user = req.user;

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
  },
  assignProject: async (req, res) => {
    const { freelancerUserId, amount, amountCurrency, amountType } = req.body;
    const { projectId } = req.params;

    try {
      const existingJob = await Job.findOne({ 
        where: {
          [Sequelize.Op.and]: [
            { projectId },
            { 
              status: {
                [Sequelize.Op.not]: JobStatus.REASSIGNED
              }
            }
          ]
        }
      })

      if (existingJob?.userId != freelancerUserId) {
        await Job.create({ amount, amountCurrency, amountType, userId: freelancerUserId, projectId }).then(() => {
          return Project.update({ active: false }, { where: { id: projectId } })
        });

        return res.status(200).send({ message: 'Project assigned successfully' });
      } else {
        throw new Error('This project is already assigned to this user')
      }

    } catch (err) {
      res.status(400).send({ message: 
        err?.errors?.map?.(error => error?.message)?.join?.(', ') 
        || err.message 
      });
    }
  }
}

module.exports = ProjectController;
