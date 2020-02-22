import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET_KEY } = process.env;

/**
 * A Encrypt class to hash password, compare hashed password & generate token
 */
class Encrypt {
  /**
   * hashPassword Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {string} password
   * @returns {string} returns hashed password
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  /**
   * comparePassword Method
   *
   * @author Verdotte Aututu
   * @static
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} returns True or False
   */
  static comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * Generate Token Method
   *
   * @author Verdotte Aututu
   * @static
   * @param  {string} _id
   * @returns  {string} returns token
   */
  static generateToken(_id) {
    const token = jwt.sign({ _id }, JWT_SECRET_KEY, {
      expiresIn: '2d',
    });
    return token;
  }

  /**
   * Generate slug Method
   *
   * @author Verdotte Aututu
   * @static
   * @param  {string} text
   * @returns  {string} returns slug
   */
  static slugGenerator(text) {
    return `${text}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;
  }
}

export default Encrypt;
