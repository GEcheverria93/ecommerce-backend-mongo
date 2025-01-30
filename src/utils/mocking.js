const bcrypt = require('bcrypt');

function generateUsers(num) {
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
}

module.exports = { generateUsers };
