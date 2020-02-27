import { Schema, model } from 'mongoose';
import Encrypt from '../helpers/encrypt';

const OrderSchema = new Schema({
  foodName: {
    type: String,
    required: true,
  },
  foodPrice: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
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
  active: {
    type: Boolean,
    default: true,
  },
});

OrderSchema.pre('save', function cb(next) {
  if (!this.slug) {
    this.slug = Encrypt.slugGenerator(this.foodName);
  }
  next();
});

export default model('Order', OrderSchema);
