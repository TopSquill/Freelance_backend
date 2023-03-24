const { Job } = require("../models");
const JobStatus = require("../utils/constants/JobStatus");

class JobsController {
    async create(req, res) {
        const { projectId } = req.body;
        const user = req.user;

        try {
            const job = await Job.create({ userId: user.id, projectId, status:JobStatus.PENDING });
            return res.status(200).send({ job })
        } catch(err) {
            res.status(400).send({ message: err.message })
        }
    }

    async update(req, res) {
        const { projectId, jobStatus } = req.body;
        const user = req.user;

        try {
            const job = await Job.create({ userId: user.id, projectId, status: jobStatus });

            return res.status(200).send({ job })
        } catch(err) {
            res.status(400).send({ message: err.message })
        }
    }
}

module.exports = new ProposalsController()
