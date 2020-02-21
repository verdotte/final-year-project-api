import jwt from 'jsonwebtoken';
import { User, Token } from '../models';
import { HTTP_UNAUTHORIZED } from '../constants/httpStatusCodes';
import Response from '../helpers/response';

const { JWT_SECRET_KEY } = process.env;

const checkAuth = async (req, res, next) => {
  let user;
  const { authorization = '' } = req.headers;
  const token = authorization.slice(7);

  if (!token) {
    return Response.handleError(
      HTTP_UNAUTHORIZED,
      'Unauthorized access',
      res,
    );
  }

  const foundToken = await Token.findOne({
    token,
  });

  if (!foundToken) {
    return Response.handleError(
      HTTP_UNAUTHORIZED,
      'Authentication required. Please login',
      res,
    );
  }

  jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
    if (err || !decoded) {
      return res
        .status(401)
        .json({ status: 401, message: 'Unauthorized access', err });
    }

    user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return Response.handleError(
        HTTP_UNAUTHORIZED,
        'Unauthorized access for user',
        res,
      );
    }

    req.currentUser = user;
    next();
  });
};

export default checkAuth;
