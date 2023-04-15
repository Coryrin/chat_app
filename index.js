const express = require('express');
const { userRouter, messagesRouter } = require('./routes');

const app = express();

const PORT = 3000;

app.use('/user', userRouter);
app.use('/messages', messagesRouter);

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`)
});