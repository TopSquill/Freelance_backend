const router = require('express').Router();
const ProposalsController = require('../controllers/ProposalsController');
const authMiddleware = require('../middlewares');
const UserTypes = require('../utils/constants/UserTypes');


router.post('/', authMiddleware([UserTypes.FREELANCER, UserTypes.VENDOR]), ProposalsController.create);
router.put('/:proposalId', authMiddleware([UserTypes.FREELANCER, UserTypes.VENDOR]), ProposalsController.update);
router.delete('/:proposalId', authMiddleware([UserTypes.FREELANCER, UserTypes.VENDOR]), ProposalsController.deleteProposal);

module.exports = router;
