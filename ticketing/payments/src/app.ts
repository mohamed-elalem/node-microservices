import express from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import morgan from 'morgan';
import { errorHandler, NotFoundError, requireAuth, currentUser } from '@elalemtickets/common'
import { createChargeRouter } from './routes/new';



const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(cookieSession({signed: false, secure: process.env.NODE_ENV !== 'test'}));
app.use(morgan("combined"));
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };