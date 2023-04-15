const express = require('express');

const router = express.Router();

router.post('/group/create', (req, res) => {
    res.send('Create group endpoint hit');
});

router.post('/message/create', (req, res) => {
    res.send('Create message endpoint hit');
});

router.get('/messages/:groupId', (req, res) => {
    res.send('Get messages for group id hit');
});

module.exports = router;