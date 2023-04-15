import express, { Express } from 'express';
import { userRouter, messageRouter } from './routes';

const app: Express = express();

const PORT: number = 3000;

app.use('/user', userRouter);
app.use('/messages', messageRouter);

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
});