import Joi from '@hapi/joi';
import joiHandler from '../../helpers/joiHandler';

const orderValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    foodName: Joi.string().required(),
    foodPrice: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    location: Joi.string().required(),
    restaurantId: Joi.required(),
    quantity: Joi.number().required(),
  });

  joiHandler(req, res, schema, next);
};

export default orderValidator;
