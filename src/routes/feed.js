import express from 'express';
import FeedController from '../controllers/feedController';
import { asyncHandler } from '../middlewares';

const router = express.Router();

router.route('/feed').get(asyncHandler(FeedController.foodFeed));
router
  .route('/feed/:restaurantId')
  .get(asyncHandler(FeedController.findFoodByRestaurantId));

export default router;
