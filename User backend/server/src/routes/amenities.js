import express from 'express';
import {
  getAmenities,
  getAmenity,
  createAmenity,
  updateAmenity,
  deleteAmenity,
  getAmenitiesByCommunity,
  bookAmenity,
  getAmenityBookings,
  rateAmenity
} from '../controllers/amenities.js';

import { protect, authorize, belongsToCommunity } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAmenities)
  .post(authorize('admin'), createAmenity);

router.route('/:id')
  .get(getAmenity)
  .put(authorize('admin'), updateAmenity)
  .delete(authorize('admin'), deleteAmenity);

router.route('/community/:communityId')
  .get(belongsToCommunity, getAmenitiesByCommunity);

router.route('/:id/book')
  .post(bookAmenity);

router.route('/:id/bookings')
  .get(getAmenityBookings);

router.route('/:id/ratings')
  .post(rateAmenity);

export default router;