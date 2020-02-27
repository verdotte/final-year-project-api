import { Order } from '../models';
import { HTTP_UNAUTHORIZED } from '../constants/httpStatusCodes';
import Response from '../helpers/response';
import { responseMessages } from '../constants';

const checkOrder = async (req, res, next) => {
  const { slug } = req.params;
  const orderFound = await Order.findOne({
    slug,
    active: true,
  });

  if (!orderFound) {
    return Response.handleError(
      HTTP_UNAUTHORIZED,
      responseMessages.notExist('order'),
      res,
    );
  }

  req.order = orderFound;
  next();
};

export default checkOrder;
