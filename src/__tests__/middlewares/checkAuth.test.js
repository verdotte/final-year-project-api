import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { Token } from '../../models';

import { checkAuth } from '../../middlewares';
import {
  HTTP_UNAUTHORIZED,
  HTTP_OK,
} from '../../constants/httpStatusCodes';
import Response from '../../helpers/response';

const response = (req, res) => {
  return Response.handleOk(HTTP_OK, 'success', res);
};

app.post('/checkAuth', checkAuth, response);

let token;
let tokenBearer;
jest.setTimeout(30000);

describe('checkAuth.js', () => {
  beforeAll(async () => {
    token = await Token.create({ token: 'token' });
    tokenBearer = `Bearer ${token.token}`;
  });

  it('should return `Unauthorized access`', async () => {
    const res = await request(app)
      .post('/checkAuth')
      .set('Authorization', tokenBearer);
    expect(res.status).toBe(HTTP_UNAUTHORIZED);
    expect(res.body.message).toBe('Unauthorized access');
  });

  it('should return `Authentication required. Please login`', async () => {
    const res = await request(app)
      .post('/checkAuth')
      .set('Authorization', 'Bearer fake-token');
    expect(res.status).toBe(HTTP_UNAUTHORIZED);
    expect(res.body.error).toBe(
      'Authentication required. Please login',
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
