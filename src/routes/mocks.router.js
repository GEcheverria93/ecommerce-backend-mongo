const express = require('express');
const { generateUsers, generatePets } = require('../utils/mocking');
const Pet = require('../models/Pet'); // Ensure you have the Pet model
const Person = require('../models/Person');

const router = express.Router();

// Endpoint /mockingpets
router.get('/mockingpets', (req, res) => {
    const pets = generatePets(50);
    res.json(pets);
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
        const generatedUsers = await generateUsers(users);
        const generatedPets = await generatePets(pets);

        const userPromises = generatedUsers.map((user) => {
            const newUser = new Person(user);
            return newUser.save();
        });

        const petPromises = generatedPets.map((pet) => {
            const newPet = new Pet(pet);
            return newPet.save();
        });

        await Promise.all([...userPromises, ...petPromises]);

        res.status(201).json({
            message: 'Data generated and inserted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating data', error });
    }
});

module.exports = router;
