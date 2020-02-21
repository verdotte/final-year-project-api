import 'dotenv/config';
import * as db from '../models';

const models = Object.keys(db);

const dropDB = async () => {
  return new Promise(resolve => {
    models.forEach(async (key, index) => {
      if (key !== 'connectDb') {
        await models[key].deleteMany({});
      }

      if (models.length >= index + 1) {
        resolve(true);
      }
    });
  });
};

const exitProcess = (code = 0) => {
  process.stdout.write('Clearing ended!');
  process.exit(code);
};

db.connectDb()
  .then(() => {
    process.stdout.write('Clearing started!');
    dropDB()
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
