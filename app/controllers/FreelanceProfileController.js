const { FreelancerProfile, FreelancerTag, FreelancerCategory, sequelize } = require("../models");
const { getUser } = require("../utils/function/user");

class FreelanceProfileController {
    async update(req, res) {
        try {
            const user = req.user;
            const { projects, links, deletedTagIds, newTagIds } = req.body;
            let freelancer = null

            await sequelize.transaction(async (t) => {
                const [freelanceProfile] = await FreelancerProfile.findOrCreate({ where: { userId: user.id }, returning: true, transaction: t })
                const dbResp = await FreelancerProfile.update({ projects, links }, { where: { id: freelanceProfile.id }, returning: true, transaction: t })
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
