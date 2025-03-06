const crypto = require('crypto');
const mongoose = require('mongoose');
const supertest = require('supertest');
const connectDB = require('../../src/db'); // Importa la función de conexión a la base de datos
const app = require('../../src/app'); // Importa la aplicación Express

const requester = supertest(app);

describe('Rutas de usuarios (CRUD)', () => {
    let expect;
    let user = {};
    let userId;
    let token;

    before(async function () {
        this.timeout(10000); // Aumenta el tiempo de espera a 10000ms
        expect = (await import('chai')).expect;
        await connectDB(); // Conecta a la base de datos usando la función importada

        // Autenticación y obtención del token
        const loginResponse = await requester
            .post('/api/sessions/login')
            .send({ email: 'robert@gmail.com', password: 'asd123' }); // Ajusta con credenciales válidas
        console.log('Login response:', loginResponse.status, loginResponse.body); // Agrega registro de depuración
        token = loginResponse.body.token;
        if (!token) {
            throw new Error('No se pudo obtener el token de autenticación');
        }
    });

    it('Crear un usuario con el metodo POST', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const newUser = {
            first_name: 'Pepe',
            last_name: 'Perez',
            email: `pepe${crypto.randomBytes(5).toString('hex')}@pepe.com`,
            password: 'coder',
            age: 20,
        };

        const { statusCode, body } = await requester
            .post('/api/sessions/register')
            .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización
            .send(newUser);
        user = body;
        userId = body._id;

        expect(statusCode).to.be.equal(201);
        expect(user).to.have.property('email');
    });

    it('Obtener todos los usuarios con el metodo GET', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const { statusCode, body: users } = await requester
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`); // Agrega el token de autorización

        expect(statusCode).to.be.equal(200);
        expect(Array.isArray(users)).to.be.ok;
    });

    it('Obtener un usuario con el metodo GET', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const { statusCode, body: user } = await requester
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`); // Agrega el token de autorización

        console.log('Get user response:', statusCode, user); // Agrega registro de depuración

        expect(statusCode).to.be.equal(200);
        expect(user).to.have.property('email');
    });

    it('Actualizar un usuario con el metodo PUT', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const updatedUser = {
            first_name: 'Pedro',
            last_name: 'Parez',
            email: `pedro${crypto.randomBytes(5).toString('hex')}@pepe.com`,
            password: 'coder',
            age: 20,
        };

        const { statusCode, body: userUpdate } = await requester
            .put(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`) // Agrega el token de autorización
            .send(updatedUser);

        console.log('Updated User:', userUpdate); // Log para depuración

        expect(statusCode).to.be.equal(200);
        expect(userUpdate).to.have.property('first_name').that.equals('Pedro');
    });

    it('Eliminar un usuario con el metodo DELETE', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const { statusCode } = await requester
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`); // Agrega el token de autorización
        const { body: rta } = await requester
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`); // Agrega el token de autorización

        expect(statusCode).to.be.equal(200);
        expect(rta).to.be.equal(null);
    });
});
