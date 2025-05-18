import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersByCommunity
} from '../controllers/users.js';

import { protect, authorize, belongsToCommunity } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

router.route('/community/:communityId')
  .get(belongsToCommunity, getUsersByCommunity);

export default router;