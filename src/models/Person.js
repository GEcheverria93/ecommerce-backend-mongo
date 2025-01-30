const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: false },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
});

const Person = mongoose.models.Person || mongoose.model('Person', personSchema);

module.exports = Person;
