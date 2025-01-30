const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
