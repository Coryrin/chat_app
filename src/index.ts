import express, { Express } from 'express';
import { userRouter, messageRouter } from './routes';
import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/chatapp';
const app: Express = express();
const PORT: number = 3000;

app.use(express.json())
app.use('/user', userRouter);
app.use('/messages', messageRouter);

const connected = mongoose.connect(uri);
connected.then(() => {
    console.log('Successfully connected to MongoDB!');
})
.catch((err) => console.log('Error connecting to mongodb', err))

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
});