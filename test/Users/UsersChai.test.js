const crypto = require('crypto');
const mongoose = require('mongoose');
const userModel = require('../../src/models/Person');

let expect;

before(async () => {
    const chai = await import('chai');
    expect = chai.expect;
});

describe('Testing User DB', async () => {
    let idUser;
    before(async () => {
        mongoose
            .connect(
                'mongodb+srv://admin:1234@cluster0.e3vab.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0'
            )
            .then(() => console.log('DB is connected'))
            .catch((e) => console.log('Error al conectarme a DB:', e));
    });

    it('Crear un usuario', async function () {
        this.timeout(5000); // Aumentar el tiempo de espera a 5000ms
        const mockUser = {
            first_name: 'Pepe',
            last_name: 'Perez',
            email: `pepe${crypto.randomBytes(5).toString('hex')}@pepe.com`,
            password: 'coder',
            age: 20,
            username: `pepe${crypto.randomBytes(5).toString('hex')}`,
            role: 'user',
        };

        const newUser = await userModel.create(mockUser);
        idUser = newUser._id;
        expect(newUser).to.have.property('email');
    });

    it('Obtener todos los usuarios', async () => {
        const users = await userModel.find();

        // expect(users).to.be.deep.equal([])
        expect(Array.isArray(users)).to.be.ok; // true con assert
    });

    it('Obtener un usuario', async () => {
        const user = await userModel.findById(idUser);

        expect(user).to.have.property('email');
        // assert.strictEqual(typeof user, "object")
    });

    it('Actualizar Un usuario', async () => {
        const mockUserUpdate = {
            first_name: 'Pedro',
            last_name: 'Parez',
            email: `pepe${crypto.randomBytes(5).toString('hex')}@pepe.com`,
            password: 'coder',
            age: 20,
            username: `pedro${crypto.randomBytes(5).toString('hex')}`,
            role: 'user',
        };

        const userUpdate = await userModel.findByIdAndUpdate(
            idUser,
            mockUserUpdate,
            { new: true, runValidators: true }
        );

        console.log('Updated User:', userUpdate); // Log para depuración

        expect(userUpdate).to.have.property('first_name').that.equals('Pedro');
        // assert.deepStrictEqual(typeof userUpdate.email, "string")
    });

    it('Eliminar Un usuario', async () => {
        const userDelete = await userModel.findByIdAndDelete(idUser);
        const rta = await userModel.findById(userDelete._id);
        expect(rta).to.be.equal(null);
        // assert.strictEqual(rta, null)
    });
});
