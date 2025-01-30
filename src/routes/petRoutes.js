const express = require('express');
const Pet = require('../models/Pet');

const router = express.Router();

router.get('/pets', async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pets', error });
    }
});

module.exports = router;
