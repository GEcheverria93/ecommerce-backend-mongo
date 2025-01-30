const express = require('express');
const { generateUsers } = require('../utils/mocking');
const User = require('../models/User'); // Ensure you have the User model
const Pet = require('../models/Pet'); // Ensure you have the Pet model

const router = express.Router();

// Endpoint /mockingpets
router.get('/mockingpets', (req, res) => {
    // ...existing code for the /mockingpets endpoint...
    res.send('Mocking pets endpoint');
});

// Endpoint /mockingusers
router.get('/mockingusers', (req, res) => {
    const users = generateUsers(50);
    res.json(users);
});

// Endpoint POST /generateData
router.post('/generateData', async (req, res) => {
    const { users, pets } = req.body;
    try {
        const generatedUsers = generateUsers(users);
        const generatedPets = generatePets(pets);

        await User.insertMany(generatedUsers);
        await Pet.insertMany(generatedPets);

        res.status(201).json({
            message: 'Data generated and inserted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating data', error });
    }
});

module.exports = router;
