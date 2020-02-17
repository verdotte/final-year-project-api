import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import getDirFiles from '../helpers/getDirFiles';

const { DATABASE_URL, DATABASE_URL_TEST, NODE_ENV } = process.env;
const URL = NODE_ENV === 'test' ? DATABASE_URL_TEST : DATABASE_URL;

const connectDb = () => {
  try {
    return mongoose.connect(URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (err) {
    logger.error(err.message);
  }
};

const db = {
  connectDb,
  ...getDirFiles(__dirname, __filename),
};

module.exports = db;
