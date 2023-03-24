const { FreelancerProfile, FreelancerTag, FreelancerCategory, sequelize } = require("../models");
const { getUser } = require("../utils/function/user");

class FreelanceProfileController {
    async create(req, res) {
        try {
            const user = req.user;
            const { projects, links, freelancerTagIds, freelancerCategoryIds } = req.body;
            let freelancerProfile;

            await sequelize.transaction(async (t) => {
                freelancerProfile = await FreelancerProfile.create({ userId: user.id, projects, links }, { transaction: t })

                await Promise.all([
                    FreelancerTag.bulkCreateRaw(freelancerProfile.id, freelancerTagIds, { transaction: t }),
                    FreelancerCategory.bulkCreateRaw(freelancerProfile.id, freelancerCategoryIds, { transaction: t })
                ]).then((success) => {
                    console.log('success insert join table--------------', success)
                }).catch(err => {
                    console.log('error in join table', err)
                    throw err;
                })
            });
            return res.status(200).send({ freelancerProfile });
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).send({ message: 'Freelancer profile already exists' })
            }
            console.log('error-------', err);
            return res.status(400).send({ message: err.message })
        }
    }

    async update(req, res) {
        try {
            const user = req.user;
            const { projects, links, deletedTagIds, newTagIds } = req.body;
            let freelancer = null

            await sequelize.transaction(async (t) => {
                const dbResp = await FreelancerProfile.update({ projects, links }, { where: { userId: user.id }, returning: true, transaction: t })
                freelancer = dbResp?.[1];
                
                if (!freelancer) t.rollback();

                Promise.all([
                    FreelancerTag.destroy({ where: deletedTagIds }, { transaction: t }),
                    FreelancerTag.bulkCreateRaw([freelancer?.id], newTagIds, { transaction: t })
                ]).catch(err => {
                    throw err;
                })
            });
            return res.status(200).send({ freelancerProfile: freelancer });
        } catch (err) {
            console.log('error-------', err);
            return res.status(400).send({ message: err.message })
        }
    }
}

module.exports = new FreelanceProfileController();
