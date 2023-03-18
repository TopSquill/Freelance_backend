const { FreelancerProfile } = require("../models");
const { getUser } = require("../utils/function/user");

class FreelanceProfileController {
    async create(req, res) {
        try {
            const user = getUser(req);
            const { projects, links } = req.body;

            const freelancerProfile = await FreelancerProfile.create({ userId: user.id, projects, links })
            res.status(200).send({ freelancerProfile });
        } catch(err) {
            console.log('error-------', err);
            res.status(400).send({ message: err.message })
        }
    }

    async update(req, res) {
        try {
            const user = getUser(req);
            const { projects, links } = req.body;

            const dbResp = await FreelancerProfile.update({ projects, links }, { where: { userId: user.id }, returning: true })
            res.status(200).send({ freelancerProfile: dbResp[1] });
        } catch(err) {
            console.log('error-------', err);
            res.status(400).send({ message: err.message })
        }
    }
}

module.exports = new FreelanceProfileController();
