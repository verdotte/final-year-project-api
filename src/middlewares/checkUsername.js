import { User } from '../models';
import { HTTP_UNAUTHORIZED } from '../constants/httpStatusCodes';
import Response from '../helpers/response';

const checkUsername = async (req, res, next) => {
  const { username } = req.body;

  const usernameExist = await User.findOne({ username });
  if (usernameExist) {
    return Response.handleError(
      HTTP_UNAUTHORIZED,
      'Username already used',
      res,
    );
  }

  next();
};

export default checkUsername;
