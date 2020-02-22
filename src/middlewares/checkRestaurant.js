import { Restaurant } from '../models';
import { HTTP_UNAUTHORIZED } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';

const checkRestaurant = async (req, res, next) => {
  const { slug } = req.params;
  const restaurantFound = await Restaurant.findOne({
    slug,
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

export default checkRestaurant;
