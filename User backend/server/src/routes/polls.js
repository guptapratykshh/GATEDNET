import express from 'express';
import {
  getPolls,
  getPoll,
  createPoll,
  updatePoll,
  deletePoll,
  getPollsByCommunity,
  votePoll
} from '../controllers/polls.js';

import { protect, authorize, belongsToCommunity } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getPolls)
  .post(authorize('admin'), createPoll);

router.route('/:id')
  .get(getPoll)
  .put(authorize('admin'), updatePoll)
  .delete(authorize('admin'), deletePoll);

router.route('/community/:communityId')
  .get(belongsToCommunity, getPollsByCommunity);

router.route('/:id/vote')
  .post(votePoll);

export default router;