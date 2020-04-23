import { Food } from '../models';
import { HTTP_UNAUTHORIZED } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';

const checkFoodOrder = async (req, res, next) => {
  const { foodSlug } = req.query;
  const foodFound = await Food.findOne({
    slug: foodSlug,
  });

  if (!foodFound) {
    return Response.handleError(
      HTTP_UNAUTHORIZED,
      responseMessages.notExist('food'),
      res,
    );
  }

  req.food = foodFound;
  next();
};

export default checkFoodOrder;
