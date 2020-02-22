import request from 'supertest';
import app from '../../app';
import { User, Token } from '../../models';

import {
  HTTP_OK,
  HTTP_UNAUTHORIZED,
  HTTP_CREATED,
} from '../../constants/httpStatusCodes';

import { userData } from '../../__mocks__/dummyData';
import { urlPrefix } from '../../__mocks__/variables';

let user, token, tokenData;

describe('User Authentication Test', () => {
  beforeAll(async () => {
    user = await User.findOne({ username: 'Nehemiah' });
    tokenData = await Token.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    token = `Bearer ${tokenData.token}`;
  });
  test('should create a `new user`', async () => {
    const res = await request(app)
      .post(`${urlPrefix}/auth/signup`)
      .send(userData);
    expect(res.status).toBe(HTTP_CREATED);
    expect(res.body.message).toBe('successful registered');
  });

  test(`should fail to create a user with same username`, async () => {
    const res = await request(app)
      .post(`${urlPrefix}/auth/signup`)
      .send(userData);
    expect(res.status).toBe(HTTP_UNAUTHORIZED);
    expect(res.body.error).toBe('Username already used');
  });

  test('should login the user', async () => {
    const res = await request(app)
      .post(`${urlPrefix}/auth/login`)
      .send(userData);
    expect(res.status).toBe(HTTP_OK);
    expect(res.body.message).toBe('successful login');
    expect(res.body.data.username).toBe(userData.username);
  });

  test(`should fail to login a user with wrong username`, async () => {
    const res = await request(app)
      .post(`${urlPrefix}/auth/login`)
      .send({ username: 'fk-username', password: userData.password });
    expect(res.status).toBe(HTTP_UNAUTHORIZED);
    expect(res.body.error).toBe(
      'The credentials you provided are incorrect',
    );
  });

  test(`should fail to login a user with wrong password`, async () => {
    userData.password = 'fk-password';
    const res = await request(app)
      .post(`${urlPrefix}/auth/login`)
      .send(userData);
    expect(res.status).toBe(HTTP_UNAUTHORIZED);
    expect(res.body.error).toBe(
      'The credentials you provided are incorrect',
    );
  });

  test(`should return user profile`, async () => {
    const res = await request(app)
      .get(`${urlPrefix}/auth/profile`)
      .set('Authorization', token);
    expect(res.status).toBe(HTTP_OK);
    expect(res.body.message).toBe('success');
    expect(res.body.data.username).toBe('Nehemiah');
  });

  afterAll(async () => {
    await User.deleteOne({ username: userData.username });
    await app.close();
    jest.clearAllMocks();
  });
});
