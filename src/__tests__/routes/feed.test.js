import request from 'supertest';
import app from '../../app';
import { Restaurant } from '../../models';

import { restaurantData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';

import { HTTP_OK } from '../../constants/httpStatusCodes';

let restaurant;
let restaurantId;
describe('Feed', () => {
  beforeAll(async () => {
    restaurant = await Restaurant.create({ ...restaurantData });
    restaurantId = restaurant._id;
  });

  describe('retreive food(s) using number of page', () => {
    test('should return `list of foods with a specified limit` ', async () => {
      const res = await request(app).get(`${urlPrefix}/feed/?page=2`);
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });

    test('should return `list of foods of specific restaurant with limit`', async () => {
      const res = await request(app).get(
        `${urlPrefix}/feed/${restaurantId}/?page=2`,
      );
      expect(res.status).toBe(HTTP_OK);
      expect(res.body.data).toBeDefined();
    });
  });
});

afterAll(async () => {
  await Restaurant.remove({});
});
