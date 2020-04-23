import { Restaurant } from '../models';
import { HTTP_UNAUTHORIZED } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';

const checkRestaurantOrder = async (req, res, next) => {
  const { restaurantId } = req.params;
  const restaurantFound = await Restaurant.findOne({
    _id: restaurantId,
  });

  if (!restaurantFound) {
    return Response.handleError(
      HTTP_UNAUTHORIZED,
      responseMessages.notExist('restaurant'),
      res,
    );
  }

  req.restaurant = restaurantFound;
  next();
};

export default checkRestaurantOrder;
