import mongoose from 'mongoose';
import dotenv from 'dotenv';

import getDirFiles from '../helpers/getDirFiles';

dotenv.config();

const { DATABASE_URL, DATABASE_URL_TEST, NODE_ENV } = process.env;
const URL = NODE_ENV === 'test' ? DATABASE_URL_TEST : DATABASE_URL;

const connectDb = () => {
  try {
    return mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    process.stdout.write(err.message);
  }
};

const db = {
  connectDb,
  ...getDirFiles(__dirname, __filename),
};

module.exports = db;
