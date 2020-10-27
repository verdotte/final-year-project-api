import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import moment from 'moment';
import Encrypt from '../helpers/encrypt';

const createdAt = moment().format('YYYY-MM-DD HH:mm ss');
const updatedAt = createdAt;

const OrderSchema = new Schema({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  food: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
  ],
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  quantity: [
    {
      type: Number,
      required: true,
    },
  ],
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: updatedAt,
  },
  active: {
    type: Boolean,
    default: createdAt,
  },
});

OrderSchema.pre('save', function cb(next) {
  if (!this.slug) {
    this.slug = Encrypt.slugGenerator(this.restaurantId);
  }
  next();
});

OrderSchema.plugin(paginate);

export default model('Order', OrderSchema);
