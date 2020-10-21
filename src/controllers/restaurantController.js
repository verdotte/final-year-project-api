import { Restaurant } from '../models';
import { HTTP_OK } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';

/**
 * Contains the restaurant routes
 *
 * @class RestaurantController
 */
class RestaurantController {
  /**
   * Create Restaurant Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async createRestaurant(req, res) {
    const { body } = req;
    const restaurant = await Restaurant.create({
      ...body,
    });

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.created('restaurant'),
      restaurant,
      res,
    );
  }

  /**
   * find Restaurant Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async findRestaurant(req, res) {
    const { restaurant } = req;
    Response.handleSuccess(HTTP_OK, 'success', restaurant, res);
  }

  /**
   * find all Restaurant Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async findAllRestaurant(req, res) {
    const restaurant = await Restaurant.find();
    Response.handleSuccess(HTTP_OK, 'success', restaurant, res);
  }

  /**
   * Update Restaurant Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async updateRestaurant(req, res) {
    const { body, restaurant } = req;
    await restaurant.updateOne({ ...body });

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.updated('restaurant'),
      { ...restaurant.toObject(), ...body },
      res,
    );
  }

  /**
   * Delete Restaurant Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async deleteRestaurant(req, res) {
    const { restaurant } = req;
    await restaurant.deleteOne();

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.deleted('restaurant'),
      restaurant,
      res,
    );
  }

  /**
   * Get Restaurant Number food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async getRestaurantNumber(req, res) {
    const foodNumber = await Restaurant.count({});

    Response.handleSuccess(HTTP_OK, 'success', foodNumber, res);
  }
}

export default RestaurantController;
