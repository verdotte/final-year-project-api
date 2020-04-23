import express from 'express';
import OrderController from '../controllers/orderController';
import { orderValidator } from '../middlewares/validations';
import {
  asyncHandler,
  checkOrder,
  checkAuth,
  checkRestaurantOrder,
  checkFoodOrder,
} from '../middlewares';

const router = express.Router();

router
  .route('/order/:restaurantId')
  .post(
    asyncHandler(checkRestaurantOrder),
    asyncHandler(checkFoodOrder),
    orderValidator,
    asyncHandler(OrderController.createOrder),
  );

router
  .route('/order')
  .get(
    asyncHandler(checkAuth),
    asyncHandler(OrderController.findAllProcessedOrder),
  );

router
  .route('/order/new')
  .get(
    asyncHandler(checkAuth),
    asyncHandler(OrderController.findAllUnProcessedOrder),
  );

router
  .route('/order/:slug')
  .get(
    asyncHandler(checkAuth),
    asyncHandler(checkOrder),
    asyncHandler(OrderController.findOrder),
  )
  .put(
    asyncHandler(checkAuth),
    asyncHandler(checkOrder),
    asyncHandler(OrderController.processOrder),
  );

export default router;
