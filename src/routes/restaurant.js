import express from 'express';
import RestaurantController from '../controllers/restaurantController';
import { restauValidator } from '../middlewares/validations';
import {
  asyncHandler,
  checkRestaurant,
  checkAuth,
} from '../middlewares';

const router = express.Router();

router
  .route('/restaurant')
  .post(
    asyncHandler(checkAuth),
    restauValidator,
    asyncHandler(RestaurantController.createRestaurant),
  )
  .get(asyncHandler(RestaurantController.findAllRestaurant));

router
  .route('/restaurant/:slug')
  .get(
    asyncHandler(checkAuth),
    asyncHandler(checkRestaurant),
    asyncHandler(RestaurantController.findRestaurant),
  )
  .put(
    asyncHandler(checkAuth),
    restauValidator,
    asyncHandler(checkRestaurant),
    asyncHandler(RestaurantController.updateRestaurant),
  )
  .delete(
    asyncHandler(checkAuth),
    asyncHandler(checkRestaurant),
    asyncHandler(RestaurantController.deleteRestaurant),
  );

export default router;
