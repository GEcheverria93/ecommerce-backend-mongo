const crypto = require('crypto');
const mongoose = require('mongoose');
const supertest = require('supertest');
const connectDB = require('../../src/db'); // Importa la función de conexión a la base de datos
const app = require('../../src/app'); // Importa la aplicación Express

const requester = supertest(app);

describe('Rutas de sesion de mi usuario (Register, Login, Current)', () => {
    let expect;
    let user = {};
    let cookie = {};

    before(async () => {
        expect = (await import('chai')).expect;
        await connectDB(); // Conecta a la base de datos usando la función importada
    });

    it('Verificar conexión al servidor', async () => {
        const res = await requester.get('/');
        console.log('Verificar conexión al servidor:', res.status);
        expect(res.status).to.be.oneOf([200, 302, 404]); // Espera un estado 200, 302 o 404
    });

    it('Ruta: api/sessions/register con el metodo POST', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const newUser = {
            first_name: 'Julieta',
            last_name: 'Jalapeño',
            email: `july${crypto.randomBytes(5).toString('hex')}@july.com`,
            password: 'coder',
            age: 20,
        };

        const { statusCode, request } = await requester
            .post('/api/sessions/register')
            .send(newUser);
        user = request._data;

        expect(statusCode).to.be.equal(201);
    });

    it('Ruta: api/sessions/login con el metodo POST', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const result = await requester.post('/api/sessions/login').send(user);
        console.log('Login response:', result.status, result.body);
        const cookieResult = result.headers['set-cookie']
            ? result.headers['set-cookie'][0]
            : null;

        if (cookieResult) {
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1],
            };

            expect(cookie.name).to.be.ok.and.equal('jwt'); // Ajusta la cookie esperada a 'jwt'
            expect(cookie.value).to.be.ok;
        } else {
            throw new Error('No se recibió la cookie de sesión');
        }
    });

    it('Ruta: api/sessions/current con el metodo GET', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const { _body, status } = await requester
            .get('/api/sessions/current')
            .set('Cookie', [`${cookie.name}=${cookie.value}`]);
        console.log('Current session response:', status, _body);

        if (_body && _body.email) {
            expect(_body.email).to.be.equal(user.email);
        } else {
            throw new Error('No se recibió la información del usuario actual');
        }
    });
});
