import express from 'express';
import {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  getIssuesByCommunity,
  addComment,
  getComments
} from '../controllers/issues.js';

import { protect, belongsToCommunity } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getIssues)
  .post(createIssue);

router.route('/:id')
  .get(getIssue)
  .put(updateIssue)
  .delete(deleteIssue);

router.route('/community/:communityId')
  .get(belongsToCommunity, getIssuesByCommunity);

router.route('/:id/comments')
  .get(getComments)
  .post(addComment);

export default router;