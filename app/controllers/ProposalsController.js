const { Proposal, Project } = require('../models');

class ProposalsController {
    async create(req, res) {
        const { projectid, message, attachments, bidType, bidCurrency, bidAmount } = req.body;
        const user = req.user;

        try {
            const project = await Project.findOne({ id: projectid });
            if (!project.active) {
                return res.status(400).send({ message: 'Project is not active for bidding' })
            }

            const proposal = await Proposal.create({
                userId: user.id,
                projectid: projectid,
                message,
                attachments,
                bidType,
                bidCurrency,
                bidAmount
            })
            // TODO send notification later
            return res.status(200).send({ message: 'Proposal sent', proposal })
        } catch {
            return res.status(400).send({ message: 'Proposal cannot be sent' })
        }
    }

    async update(req, res) {
        const { message, attachments, bidType, bidCurrency, bidAmount } = req.body;
        const { proposalId } = req.params;

        try {
            const proposal = await Proposal.update({
                message,
                attachments,
                bidType,
                bidCurrency,
                bidAmount
            }, { where: { id: proposalId } })
            // TODO send notification later
            return res.status(200).send({ message: 'Proposal updated', proposal })
        } catch {
            return res.status(400).send({ message: 'Proposal cannot be updated' })
        }
    }

    async deleteProposal(req, res) {
        const { proposalId } = req.params;

        try {
            await Proposal.destroy({ where: { id: proposalId } })
            // TODO send notification later
            return res.status(200).send({ message: 'Proposal deleted' })
        } catch {
            return res.status(400).send({ message: 'Proposal cannot be deleted' })
        }
    }
}

module.exports = new ProposalsController();
