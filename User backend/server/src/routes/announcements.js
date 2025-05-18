import express from 'express';
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementsByCommunity,
  addComment,
  getComments
} from '../controllers/announcements.js';

import { protect, authorize, belongsToCommunity } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAnnouncements)
  .post(authorize('admin'), createAnnouncement);

router.route('/:id')
  .get(getAnnouncement)
  .put(authorize('admin'), updateAnnouncement)
  .delete(authorize('admin'), deleteAnnouncement);

router.route('/community/:communityId')
  .get(belongsToCommunity, getAnnouncementsByCommunity);

router.route('/:id/comments')
  .get(getComments)
  .post(addComment);

export default router;