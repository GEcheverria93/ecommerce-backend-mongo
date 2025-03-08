const crypto = require('crypto');
const mongoose = require('mongoose');
const supertest = require('supertest');
const connectDB = require('../../src/db'); // Importa la función de conexión a la base de datos
const app = require('../../src/app'); // Importa la aplicación Express

const requester = supertest(app);

describe('Rutas pertenecientes al módulo usuario', () => {
    let expect;
    const user = {};

    before(async () => {
        expect = (await import('chai')).expect;
        await connectDB(); // Conecta a la base de datos usando la función importada
    });

    it('Ruta: api/users con el metodo GET', async function () {
        this.timeout(5000); // Aumenta el tiempo de espera a 5000ms
        const { _body, status } = await requester.get('/api/users');
        console.log('Users get response:', status, _body);

        if (_body.length > 0) {
            expect(_body[0].email).to.be.equal(user.email);
        } else {
            throw new Error('No se recibió la información del usuario actual');
        }
    });
});
