import request from 'supertest';
import app from '../../app';
import { Token, User, Restaurant } from '../../models';

import {
  HTTP_OK,
  HTTP_UNAUTHORIZED,
} from '../../constants/httpStatusCodes';

import { restaurantData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';

let tokenData;
let token;
let restaurantSlug;
let user;
describe('Restaurant', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'Nehemiah' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
  });

  describe('create a restaurant', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/restaurant`)
        .set('Authorization', 'fk-token')
        .send(restaurantData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
    });

    test('should return a `new restaurant`', async () => {
      const res = await request(app)
        .post(`${urlPrefix}/restaurant`)
        .set('Authorization', token)
        .send(restaurantData);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toHaveProperty('restaurantName');
    });
  });

  describe('update a restaurant', () => {
    beforeAll(async () => {
      const res = await request(app)
        .post(`${urlPrefix}/restaurant`)
        .set('Authorization', token)
        .send(restaurantData);
      restaurantSlug = res.body.data.slug;
    });

    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/restaurant/${restaurantSlug}`)
        .send(restaurantData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('Unauthorized access');
    });

    test('should return `restaurant not found`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/restaurant/fk-slug`)
        .set('Authorization', token)
        .send(restaurantData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('restaurant does not exist');
    });

    test('should return an `updated restaurant`', async () => {
      const res = await request(app)
        .put(`${urlPrefix}/restaurant/${restaurantSlug}`)
        .set('Authorization', token)
        .send(restaurantData);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toHaveProperty('restaurantName');
    });
  });

  describe('retreive restaurant(s)', () => {
    test('should return `restaurant array`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/restaurant`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });

    test('should return `one restaurant`', async () => {
      const res = await request(app)
        .get(`${urlPrefix}/restaurant/${restaurantSlug}`)
        .set('Authorization', token);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('delete a restaurant', () => {
    test('should return `Unauthorized access`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/restaurant/${restaurantSlug}`)
        .send(restaurantData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('Unauthorized access');
    });

    test('should return `restaurant not found`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/restaurant/fk-slug`)
        .set('Authorization', token)
        .send(restaurantData);
      expect(res.status).toBe(HTTP_UNAUTHORIZED);
      expect(res.body.error).toBe('restaurant does not exist');
    });

    test('should return a `deleted restaurant`', async () => {
      const res = await request(app)
        .delete(`${urlPrefix}/restaurant/${restaurantSlug}`)
        .set('Authorization', token)
        .send(restaurantData);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toHaveProperty('restaurantName');
    });
  });
});

afterAll(async () => {
  await Restaurant.remove({});
});
