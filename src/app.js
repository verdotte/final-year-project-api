import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import router from './routes';
import { connectDb } from './models';

const app = express();

connectDb().then(async () => {
  console.log('Mongodb connected');
});

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router(app);

export default app;
