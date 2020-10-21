import { Food, Restaurant } from '../models';
import { HTTP_OK } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';
import foodFormatter from '../helpers/foodFormatter';

/**
 * Contains the food routes
 *
 * @class FoodController
 */
class FoodController {
  /**
   * Create food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof FoodController
   */
  static async createFood(req, res) {
    const { body, restaurant } = req;
    const order = await Food.create({
      ...body,
    });

    await Restaurant.updateOne(
      { _id: restaurant._id },
      { numberOfFood: restaurant.numberOfFood + 1 },
    );

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.created('food'),
      order,
      res,
    );
  }

  /**
   * find Food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof FoodController
   */
  static async findFood(req, res) {
    const { food } = req;
    Response.handleSuccess(HTTP_OK, 'success', food, res);
  }

  /**
   * find list of food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof OrderController
   */
  static async findAllFood(req, res) {
    const food = await Food.find({}).populate(
      'restaurantId',
      'restaurantName',
    );
    if (food) {
      const foodDoc = foodFormatter(food);
      return Response.handleSuccess(HTTP_OK, 'success', foodDoc, res);
    }
    return Response.handleSuccess(HTTP_OK, 'success', food, res);
  }

  /**
   * Update Food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async updateFood(req, res) {
    const { body, food } = req;
    await food.updateOne({ ...body });

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.updated('food'),
      { ...food.toObject(), ...body },
      res,
    );
  }

  /**
   * Delete food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async deleteFood(req, res) {
    const { food } = req;
    await food.deleteOne();

    Response.handleSuccess(
      HTTP_OK,
      responseMessages.deleted('food'),
      food,
      res,
    );
  }

  /**
   * Get Food Number food Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof RestaurantController
   */
  static async getFoodNumber(req, res) {
    const foodNumber = await Food.count({});

    Response.handleSuccess(HTTP_OK, 'success', foodNumber, res);
  }
}

export default FoodController;
