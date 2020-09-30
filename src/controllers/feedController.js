import { Food } from '../models';
import { HTTP_OK } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { PAGE_LIMIT } from '../constants/general';
import foodFormatter from '../helpers/foodFormatter';

/**
 * Contains the feed routes
 *
 * @class FoodController
 */
class FeedController {
  /**
   * foodFeed
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof FeedController
   */
  static async foodFeed(req, res) {
    const { page = 1 } = req.query;
    const food = await Food.paginate(
      {
        active: true,
      },
      {
        populate: 'restaurantId',
        limit: PAGE_LIMIT,
        offset: page - 1,
      },
    );

    if (food) {
      const foodDoc = foodFormatter(food.docs);
      return Response.handleSuccess(
        HTTP_OK,
        'success',
        {
          foodDoc,
          page: food.page,
          totalPage: food.totalPages,
          totalDoc: food.totalDocs,
        },
        res,
      );
    }

    return Response.handleSuccess(
      HTTP_OK,
      'success',
      { food, page, limit: PAGE_LIMIT },
      res,
    );
  }

  /**
   * FindFoodByRestaurantId
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof FeedController
   */
  static async findFoodByRestaurantId(req, res) {
    const { page = 1 } = req.query;
    const { restaurantId } = req.params;
    const food = await Food.paginate(
      {
        active: true,
        restaurantId,
      },
      {
        populate: 'restaurantId',
        limit: PAGE_LIMIT,
        offset: page - 1,
      },
    );
    if (food) {
      const foodDoc = foodFormatter(food.docs);
      return Response.handleSuccess(
        HTTP_OK,
        'success',
        {
          foodDoc,
          page: food.page,
          totalPage: food.totalPages,
          totalDoc: food.totalDocs,
        },
        res,
      );
    }

    return Response.handleSuccess(
      HTTP_OK,
      'success',
      { food, page, limit: PAGE_LIMIT },
      res,
    );
  }
}

export default FeedController;
