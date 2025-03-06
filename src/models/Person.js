const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    email: { type: String, required: true, unique: true },
    first_name: { type: String, required: true }, // Añadir campo first_name
    last_name: { type: String, required: true }, // Añadir campo last_name
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
});

const Person = mongoose.models.Person || mongoose.model('Person', personSchema);

module.exports = Person;
