import Responses from './response';
import { HTTP_BAD_REQUEST } from '../constants/httpStatusCodes';

const options = {
  language: {
    key: '{{key}} ',
  },
};

/**
 * Handles Joi Errors
 *
 * @author Verdotte Aututu
 * @param {*} req
 * @param {*} res
 * @param {object} schema
 * @param {*} next
 * @return {object} returns a response error
 */
const joiHandler = (req, res, schema, next) => {
  const { error } = schema.validate(req.body, options);
  if (error) {
    return Responses.errorResponse(HTTP_BAD_REQUEST, res, error);
  }
  next();
};

export default joiHandler;
