const UserDTO = require('../../dtos/userDto');
const User = require('./models/userModel');

class UserDAO {
    async create(userData) {
        const user = await User.create(userData);
        return new UserDTO(user);
    }

    async findById(id) {
        const user = await User.findById(id);
        return user ? new UserDTO(user) : null;
    }

    async findByEmail(email) {
        const user = await User.findOne({ email });
        return user ? new UserDTO(user) : null;
    }

    async findByEmailWithPassword(email) {
        return User.findOne({ email });
    }

    async update(id, userData) {
        const user = await User.findByIdAndUpdate(id, userData, { new: true });
        return user ? new UserDTO(user) : null;
    }
}

module.exports = UserDAO;
