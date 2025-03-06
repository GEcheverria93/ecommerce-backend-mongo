const Assert = require('assert');
const crypto = require('crypto');
const mongoose = require('mongoose');
const userModel = require('../../src/models/Person.js');

const assert = Assert.strict;

describe('Testing User DB', function () {
    this.timeout(10000); // Aumenta el tiempo de espera a 10 segundos

    let idUser;
    before(async () => {
        await mongoose
            .connect(
                'mongodb+srv://admin:1234@cluster0.e3vab.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'
            )
            .then(() => console.log('DB is connected'))
            .catch((e) => console.log('Error al conectarme a DB:', e));
    });

    it('Crear un usuario', async () => {
        const mockUser = {
            first_name: 'Pepe',
            last_name: 'Perez',
            email: `pepe${crypto.randomBytes(5).toString('hex')}@pepe.com`,
            password: 'coder',
            age: 20,
            role: 'user',
            username: `pepe${crypto.randomBytes(5).toString('hex')}`,
        };

        const newUser = await userModel.create(mockUser);
        idUser = newUser._id;
        assert.deepStrictEqual(typeof newUser.email, 'string'); // Verifica que el email sea una cadena
    });

    it('Obtener todos los usuarios', async () => {
        const users = await userModel.find();

        assert.strictEqual(Array.isArray(users), true);
    });

    it('Obtener un usuario', async () => {
        const user = await userModel.findById(idUser);

        assert.strictEqual(typeof user, 'object');
    });

    it('Actualizar Un usuario', async () => {
        const mockUserUpdate = {
            first_name: 'Pedro',
            last_name: 'Parez',
            email: `pedro${crypto.randomBytes(5).toString('hex')}@pepe.com`,
            password: 'coder',
            age: 20,
            role: 'user',
            username: `pedro${crypto.randomBytes(5).toString('hex')}`,
        };

        const userUpdate = await userModel.findByIdAndUpdate(
            idUser,
            mockUserUpdate,
            { new: true }
        );

        assert.deepStrictEqual(typeof userUpdate.email, 'string');
    });

    it('Eliminar Un usuario', async () => {
        const userDelete = await userModel.findByIdAndDelete(idUser);
        if (userDelete) {
            const rta = await userModel.findById(userDelete._id);
            assert.strictEqual(rta, null);
        } else {
            assert.fail('Usuario no encontrado para eliminar');
        }
    });
});
