import express from 'express';
import OrderController from '../controllers/orderController';
// import { orderValidator } from '../middlewares/validations';
import {
  asyncHandler,
  checkOrder,
  checkAuth,
  checkRestaurantOrder,
} from '../middlewares';

const router = express.Router();

router
  .route('/order')
  .post(
    asyncHandler(checkRestaurantOrder),
    asyncHandler(OrderController.placeOrder),
  );

router
  .route('/order/new')
  .get(
    asyncHandler(checkAuth),
    asyncHandler(OrderController.findAllNewOrder),
  );

router
  .route('/order')
  .get(
    asyncHandler(checkAuth),
    asyncHandler(OrderController.findAllExistingOrder),
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
