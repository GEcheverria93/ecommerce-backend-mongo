const express = require('express');
const Person = require('../models/Person');

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await Person.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

module.exports = router;
