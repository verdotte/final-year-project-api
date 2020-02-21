import Joi from '@hapi/joi';
import joiHandler from '../../helpers/joiHandler';

const authValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .min(3)
      .required(),
    password: Joi.string()
      .required()
      .min(5),
  });

  joiHandler(req, res, schema, next);
};

export default authValidator;
