import { Order, Restaurant, Food } from '../models';
import { HTTP_OK } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';
import orderFormatter from '../helpers/orderFormatter';
import notifier from '../helpers/notifier';

/**
 * Contains the order routes
 *
 * @class OrderController
 */
class OrderController {
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
  static async findAllProcessedOrder(req, res) {
    let order = await Order.find({
      active: false,
    }).populate('restaurantId', 'restaurantName');

    order = orderFormatter(order);
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
  static async findAllUnProcessedOrder(req, res) {
    let order = await Order.find({
      active: true,
    }).populate('restaurantId', 'restaurantName');

    order = orderFormatter(order);
    Response.handleSuccess(HTTP_OK, 'success', order, res);
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
}

export default OrderController;
