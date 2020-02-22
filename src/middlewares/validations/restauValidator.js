import Joi from '@hapi/joi';
import joiHandler from '../../helpers/joiHandler';

const restauValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    restaurantName: Joi.string().required(),
    restaurantImage: Joi.string(),
    restaurantContact: Joi.string()
      .max(13)
      .min(10),
    restaurantAddress: Joi.string().required(),
  });

  joiHandler(req, res, schema, next);
};

export default restauValidator;
