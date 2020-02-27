import { Schema, model } from 'mongoose';
import Encrypt from '../helpers/encrypt';

const RestaurantSchema = new Schema({
  restaurantName: {
    type: String,
    required: true,
  },
  restaurantImage: {
    type: String,
    default: null,
  },
  restaurantAddress: {
    type: String,
    required: true,
  },
  restaurantContact: {
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
});

RestaurantSchema.pre('save', function cb(next) {
  if (!this.slug) {
    this.slug = Encrypt.slugGenerator(this.restaurantName);
  }
  next();
});

export default model('Restaurant', RestaurantSchema);
