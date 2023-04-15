const express = require('express');

const router = express.Router();

router.post('/create', (req, res) => {
    res.send('User creation endpoint hit!');
});

router.post('/signin', (req, res) => {
    res.send('User sign in endpoint hit!');
});

module.exports = router;