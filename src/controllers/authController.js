import { User, Token } from '../models';
import Encrypt from '../helpers/encrypt';
import {
  HTTP_CREATED,
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from '../constants/httpStatusCodes';
import Response from '../helpers/response';

/**
 * Contains the authentification routes
 *
 * @class AuthController
 */
class AuthController {
  /**
   * Sign up only for the Admin
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof AuthController
   */
  static async signUp(req, res) {
    const hashPassword = Encrypt.hashPassword(req.body.password);
    const { username } = req.body;

    const user = await User.create({
      username,
      password: hashPassword,
    });

    const token = Encrypt.generateToken(user._id);
    await Token.create({ user: user._id, token });

    return Response.handleSuccess(
      HTTP_CREATED,
      'successful registered',
      { username: user.username, token },
      res,
    );
  }

  /**
   * Login only for the Admin
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof AuthController
   */
  static async login(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !Encrypt.comparePassword(user.password, password)) {
      return Response.handleError(
        HTTP_UNAUTHORIZED,
        'The credentials you provided are incorrect',
        res,
      );
    }

    const token = Encrypt.generateToken(user._id);
    await Token.create({ user: user._id, token });

    return Response.handleSuccess(
      HTTP_OK,
      'successful login',
      { username: user.username, token },
      res,
    );
  }

  /**
   * Get Admin Profile
   *
   * @author Verdotte Aututu
   * @static
   * @param {*} req
   * @param {*} res
   * @returns {object} res
   * @memberof AuthController
   */
  static profile(req, res) {
    const { username } = req.currentUser;
    return Response.handleSuccess(
      HTTP_OK,
      'success',
      { username },
      res,
    );
  }
}

export default AuthController;
