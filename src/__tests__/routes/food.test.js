import request from 'supertest';
import app from '../../app';
import { Token, User, Restaurant, Food } from '../../models';

import {
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from '../../constants/httpStatusCodes';

import { restaurantData, foodData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';

let tokenData;
let token;
let restaurant;
let restaurantSlug;
let foodSlug;
let user;
describe('Food', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'Nehemiah' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
    restaurant = await Restaurant.create({ ...restaurantData });
    restaurantSlug = restaurant.slug;
    foodData.restaurantId = restaurant._id;
  });

  describe('create food', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/food/${restaurantSlug}`)
        .set('Authorization', 'fk-token')
        .send(foodData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
    });

    test('should return a `new food`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/food/${restaurantSlug}`)
        .set('Authorization', token)
        .send(foodData);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toHaveProperty('foodName');
    });

    test('should fail to create a `new food`', async () => {
      foodData.foodName = '';
      const res = await request(app)
        .post(`${urlPrefix}/food/${restaurantSlug}`)
        .set('Authorization', token)
        .send(foodData);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        'foodName is not allowed to be empty',
      );
    });
  });

  describe('update food', () => {
    beforeAll(async () => {
      foodData.foodName = 'Pizza';
      const res = await request(app)
        .post(`${urlPrefix}/food/${restaurantSlug}`)
        .set('Authorization', token)
        .send(foodData);
      foodSlug = res.body.data.slug;
    });
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/food/${foodSlug}`)
        .send(foodData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('Unauthorized access');
    });
    test('should return `food not found`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/food/fk-slug`)
        .set('Authorization', token)
        .send(foodData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('food does not exist');
    });
    test('should return an `updated food `', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/food/${foodSlug}`)
        .set('Authorization', token)
        .send(foodData);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toHaveProperty('foodName');
    });
  });

  describe('retreive food(s)', () => {
    test('should return `list of foods`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/food`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });

    test('should return `one food`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/food/${foodSlug}`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('delete food', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app).delete(
        `${urlPrefix}/food/${foodSlug}`,
      );
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('Unauthorized access');
    });
    test('should return `food not found`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/food/fk-slug`)
        .set('Authorization', token)
        .send(foodData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('food does not exist');
    });
    test('should return `deleted food`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/food/${foodSlug}`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toHaveProperty('foodName');
    });
  });
});

afterAll(async () => {
  await Restaurant.remove({});
  await Food.remove({});
});
