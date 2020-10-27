/* eslint-disable no-plusplus */
import moment from 'moment';
import { Order, Restaurant, Food } from '../models';
import {
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';
import notifier from '../helpers/notifier';
import { PAGE_LIMIT } from '../constants/general';

/**
 * Contains the order routes
 *
 * @class OrderController
 */
class OrderController {
  /**
   * Create Order Method
   * @author Verdotte Aututu
   * @deprecated
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof OrderController
   */
  static async createOrder(req, res) {
    const { body, restaurant, food } = req;
    const order = await Order.create({
      ...body,
    });

    await Restaurant.updateOne(
      { _id: restaurant._id },
      { numberOfOrder: restaurant.numberOfOrder + 1 },
    );

    await Food.updateOne(
      { _id: food._id },
      { numberOfOrder: food.numberOfOrder + 1 },
    );

    notifier('order', restaurant, res.app.connection);

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.created('order'),
      order,
      res,
    );
  }

  /**
   * find Order Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof OrderController
   */
  static async findOrder(req, res) {
    const { order } = req;
    Response.handleSuccess(HTTP_OK, 'success', order, res);
  }

  /**
   * find all processed order Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof OrderController
   */
  static async findAllExistingOrder(req, res) {
    const { page = 1 } = req.query;
    const order = await Order.paginate(
      { active: false },
      {
        populate: ['restaurantId', 'food'],
        limit: PAGE_LIMIT,
        offset: page - 1,
        sort: { createdAt: -1 },
      },
    );
    // await Order.remove({});

    if (order) {
      const orderDoc = OrderController.orderFormatter(order.docs);
      return Response.handleSuccess(
        HTTP_OK,
        'success',
        {
          orderDoc,
          page: order.page,
          totalPage: order.totalPages,
          totalDoc: order.totalDocs,
        },
        res,
      );
    }

    return Response.handleSuccess(HTTP_OK, 'success', order, res);
  }

  /**
   * find all processed order Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof OrderController
   */
  static async findAllNewOrder(req, res) {
    const { page = 1 } = req.query;
    const order = await Order.paginate(
      { active: true },
      {
        populate: ['restaurantId', 'food'],
        limit: PAGE_LIMIT,
        offset: page - 1,
        sort: { createdAt: -1 },
      },
    );

    if (order) {
      const orderDoc = OrderController.orderFormatter(order.docs);
      return Response.handleSuccess(
        HTTP_OK,
        'success',
        {
          orderDoc,
          page: order.page,
          totalPage: order.totalPages,
          totalDoc: order.totalDocs,
        },
        res,
      );
    }

    return Response.handleSuccess(HTTP_OK, 'success', order, res);
  }

  /**
   * Process Order Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof OrderController
   */
  static async processOrder(req, res) {
    const { order } = req;
    await order.updateOne({
      active: false,
    });

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.updated('order'),
      order,
      res,
    );
  }

  /**
   * Clear All Order Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof OrderController
   */
  static async clearAllOrder(req, res) {
    await Order.remove({});
    Response.handleSuccess(HTTP_OK, 'cleared!', {}, res);
  }

  /**
   * Create Order Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof OrderController
   */
  static async placeOrder(req, res) {
    const {
      location,
      restaurantId,
      phoneNumber,
      orderFood,
    } = req.body;
    const { restaurant } = req;
    const food = [];
    const foodQuantity = [];

    const createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const updatedAt = createdAt;

    orderFood.forEach(async ({ foodId, quantity }) => {
      food.push(foodId);
      foodQuantity.push(quantity);
      const foodItem = await Food.findOne({
        _id: foodId,
      });

      if (!foodItem) {
        return Response.handleError(
          HTTP_UNAUTHORIZED,
          responseMessages.notExist('food'),
          res,
        );
      }

      await Food.updateOne(
        { _id: foodId },
        { numberOfOrder: foodItem.numberOfOrder + 1 },
      );
    });

    const order = await Order.create({
      location,
      phoneNumber,
      restaurantId,
      food,
      quantity: foodQuantity,
      updatedAt,
      createdAt,
    });

    await Restaurant.updateOne(
      { _id: restaurantId },
      { numberOfOrder: restaurant.numberOfOrder + 1 },
    );

    notifier('order', restaurant, res.app.connection);

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.created('order'),
      { order },
      res,
    );
  }

  /**
   * Get New Order Number food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async getNewOrderNumber(req, res) {
    const foodNumber = await Order.countDocuments({
      active: true,
    });

    Response.handleSuccess(HTTP_OK, 'success', foodNumber, res);
  }

  /**
   * Get Old Number food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async getOldOrderNumber(req, res) {
    const foodNumber = await Order.countDocuments({
      active: false,
    });

    Response.handleSuccess(HTTP_OK, 'success', foodNumber, res);
  }

  /**
   * Order Mapper
   * @author Verdotte Aututu
   *
   * @static
   * @param {Array} food
   * @param {Array} quantity
   * @returns {object}
   * @memberof OrderController
   */
  static orderMapper(food, quantity) {
    let totalPrice = 0;
    const orderFood = [];
    const totalFood = food.length;
    for (let i = 0; i < totalFood; i++) {
      totalPrice += food[i].foodPrice * quantity[i];
      orderFood.push({
        foodName: food[i].foodName,
        foodPrice: food[i].foodPrice,
        foodImage: food[i].foodImage,
        cookingTime: food[i].cookingTime,
        quantity: quantity[i],
      });
    }

    return { totalPrice, totalFood, orderFood };
  }

  /**
   * find all processed order Method
   * @author Verdotte Aututu
   *
   * @static
   * @param {Array[object]} order
   * @returns {object} res
   * @memberof OrderController
   */
  static orderFormatter(order) {
    order = order.map(
      ({
        phoneNumber,
        location,
        slug,
        _id,
        createdAt,
        updatedAt,
        quantity,
        restaurantId: { restaurantName },
        food,
      }) => {
        const {
          totalPrice,
          totalFood,
          orderFood,
        } = OrderController.orderMapper(food, quantity);
        return {
          phoneNumber,
          location,
          slug,
          orderId: _id,
          createdAt,
          updatedAt,
          orderFood,
          totalPrice,
          totalFood,
          restaurantName,
        };
      },
    );
    return order;
  }
}

export default OrderController;
