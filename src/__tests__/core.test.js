import request from 'supertest';
import app from '../app';

import {
  HTTP_OK,
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_NOT_FOUND,
} from '../constants/httpStatusCodes';

describe('Request Tests', () => {
  test('Should return success request', done => {
    request(app)
      .get('/')
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.status).toBe(HTTP_OK);
        expect(res.body.message).toBe('Welcome to Restaurant API');
        done();
      });
  });

  test('Should return bad request', done => {
    request(app)
      .get('/wrong')
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.status).toBe(HTTP_NOT_FOUND);
        expect(res.body.error).toBe('Invalid route');
        done();
      });
  });

  test('Should return invalid method', done => {
    request(app)
      .post('/')
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.status).toBe(HTTP_METHOD_NOT_ALLOWED);
        expect(res.body.error).toBe('Invalid method');
        done();
      });
  });
});
