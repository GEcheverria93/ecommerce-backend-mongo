const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    age: { type: Number, required: true },
});

const Pet = mongoose.models.Pet || mongoose.model('Pet', petSchema);

module.exports = Pet;
