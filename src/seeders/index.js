import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { connectDb, User, Token } from '../models';
import Encrypt from '../helpers/encrypt';

const { JWT_SECRET_KEY } = process.env;
const users = [
  { username: 'Nehemiah' },
  { username: 'Yonatan' },
  { username: 'Ousman' },
];

const seedUsers = async () => {
  return new Promise(resolve => {
    users.forEach(async (val, index) => {
      const password = Encrypt.hashPassword('Admin123456');
      await User.updateOne(
        { username: val.username },
        { ...val, password },
        { upsert: true, setDefaultsOnInsert: true },
      );
      const user = await User.findOne({ username: val.username });
      const token = jwt.sign({ _id: user._id }, JWT_SECRET_KEY);
      process.stdout.write(
        ` username: ${user.username}, Token ${index + 1}: ${token} `,
      );
      await Token.create({ user: user._id, token });
      if (users.length >= index + 1) {
        resolve(true);
      }
    });
  });
};

const exitProcess = (code = 0) => {
  process.stdout.write('Seeding ended!');
  process.exit(code);
};

connectDb()
  .then(() => {
    process.stdout.write('Seeding started!');
    seedUsers()
      .then(() => {
        exitProcess();
      })
      .catch(() => {
        exitProcess(1);
      });
  })
  .catch(err => {
    process.stdout.write(`Failed! ${err.message}`);
    process.exit();
  });
