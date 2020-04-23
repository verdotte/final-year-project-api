import request from 'supertest';
import app from '../../app';
import { Token, User, Restaurant, Order, Food } from '../../models';

import {
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from '../../constants/httpStatusCodes';

import {
  restaurantData,
  orderData,
  foodData,
} from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';

let tokenData;
let token;
let restaurant;
let restaurantId;
let orderSlug;
let user;
let food;
let foodSlug;
describe('Order', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'Nehemiah' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
    restaurant = await Restaurant.create({ ...restaurantData });
    restaurantId = restaurant._id;
    orderData.restaurantId = restaurant._id;
    food = await Food.create({ ...foodData });
    foodSlug = food.slug;
  });

  describe('create order', () => {
    test('should return a `new order`', async () => {
      const res = await request(app)
        .post(
          `${urlPrefix}/order/${restaurantId}/?foodSlug=${foodSlug}`,
        )
        .send(orderData);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toHaveProperty('foodName');
    });

    test('should fail to create a `new order`', async () => {
      delete orderData.foodName;
      const res = await request(app)
        .post(
          `${urlPrefix}/order/${restaurantId}/?foodSlug=${foodSlug}`,
        )
        .send(orderData);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('foodName is required');
    });
  });

  describe('process an order', () => {
    beforeAll(async () => {
      orderData.foodName = 'Rice';
      const res = await request(app)
        .post(
          `${urlPrefix}/order/${restaurantId}/?foodSlug=${foodSlug}`,
        )
        .set('Authorization', token)
        .send(orderData);
      orderSlug = res.body.data.slug;
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/order/${orderSlug}`)
        .send(orderData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('Unauthorized access');
    });

    test('should return `order not found`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/order/fk-slug`)
        .set('Authorization', token)
        .send(orderData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('order does not exist');
    });

    test('should return `an unprocessed order`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/order/${orderSlug}`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });

    test('should process an order', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/order/${orderSlug}`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.message).toBe(
        'order has been updated successfully',
      );
      expect(res.body.data).toHaveProperty('foodName');
    });
  });

  describe('retreive order(s)', () => {
    test('should return `list of processed order`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/order`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });

    test('should return `list of unprocessed order`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/order/new`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });
  });
});

afterAll(async () => {
  await Restaurant.remove({});
  await Order.remove({});
  await Food.remove({});
});
