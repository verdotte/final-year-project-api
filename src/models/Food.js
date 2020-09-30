import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import Encrypt from '../helpers/encrypt';

const FoodSchema = new Schema({
  foodName: {
    type: String,
    required: true,
  },
  foodPrice: {
    type: Number,
    required: true,
  },
  foodImage: {
    type: String,
    default: null,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  cookingTime: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  numberOfOrder: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

FoodSchema.pre('save', function cb(next) {
  if (!this.slug) {
    this.slug = Encrypt.slugGenerator(this.foodName);
  }
  next();
});

FoodSchema.plugin(paginate);

export default model('Food', FoodSchema);
