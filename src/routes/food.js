import express from 'express';
import FoodController from '../controllers/foodController';
import { foodValidator } from '../middlewares/validations';
import {
  asyncHandler,
  checkAuth,
  checkRestaurant,
  checkFood,
} from '../middlewares';

const router = express.Router();

router.route('/food').get(asyncHandler(FoodController.findAllFood));

router
  .route('/food/:slug')
  .post(
    asyncHandler(checkAuth),
    asyncHandler(checkRestaurant),
    foodValidator,
    asyncHandler(FoodController.createFood),
  );

router
  .route('/food/:slug')
  .get(
    asyncHandler(checkAuth),
    asyncHandler(checkFood),
    asyncHandler(FoodController.findFood),
  )
  .put(
    asyncHandler(checkAuth),
    asyncHandler(checkFood),
    foodValidator,
    asyncHandler(FoodController.updateFood),
  )
  .delete(
    asyncHandler(checkAuth),
    asyncHandler(checkFood),
    asyncHandler(FoodController.deleteFood),
  );

export default router;
