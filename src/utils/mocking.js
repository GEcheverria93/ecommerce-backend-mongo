const bcrypt = require('bcrypt');

// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

const generateUsers = async (num) => {
    const users = [];
    for (let i = 0; i < num; i++) {
        const user = {
            username: `user${i}`,
            password: bcrypt.hashSync('coder123', 10),
            role: Math.random() > 0.5 ? 'user' : 'admin',
            pets: [],
        };
        users.push(user);
    }
    return users;
};

const petTypes = ['perro', 'gato', 'leon', 'tigre', 'conejo', 'hamster'];

const generatePets = async (num) => {
    const pets = [];
    for (let i = 0; i < num; i++) {
        const pet = {
            name: faker.person.firstName(),
            type: petTypes[Math.floor(Math.random() * petTypes.length)],
            age: Math.floor(Math.random() * 15) + 1,
        };
        pets.push(pet);
    }
    return pets;
};

module.exports = { generateUsers, generatePets };
