import { Food } from '../models';
import { HTTP_UNAUTHORIZED } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';

const checkFood = async (req, res, next) => {
  const { slug } = req.params;
  const foodFound = await Food.findOne({
    slug,
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

export default checkFood;
