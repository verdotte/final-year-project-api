import Joi from '@hapi/joi';
import joiHandler from '../../helpers/joiHandler';

const foodValidator = (req, res, next) => {
  const schema = Joi.object().keys({
    foodName: Joi.string().required(),
    foodPrice: Joi.number().required(),
    cookingTime: Joi.string().required(),
    restaurantId: Joi.required(),
    foodImage: Joi.string(),
  });

  joiHandler(req, res, schema, next);
};

export default foodValidator;
