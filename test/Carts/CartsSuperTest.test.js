const mongoose = require('mongoose');
const supertest = require('supertest');
const connectDB = require('../../src/db');
const app = require('../../src/app');

const requester = supertest(app);

describe('Rutas de Carritos (CRUD Operations)', () => {
    let expect;
    let cartId;
    
    before(async () => {
        expect = (await import('chai')).expect;
        await connectDB();
    });

    it('Verificar conexión al servidor', async () => {
        const res = await requester.get('/');
        console.log('Verificar conexión al servidor:', res.status);
        expect(res.status).to.be.oneOf([200, 302, 404]);
    });

    it('Ruta: /api/carts con el método POST - Crear nuevo carrito', async function() {
        this.timeout(5000);
        const { statusCode, body } = await requester
            .post('/api/carts');

        console.log('Crear carrito response:', statusCode, body);
        expect(statusCode).to.be.equal(201);
        expect(body).to.have.property('id');
        expect(body).to.have.property('products');
        expect(body).to.have.property('total');
        
        cartId = body.id;
    });

    it('Ruta: /api/carts con el método GET - Obtener todos los carritos', async function() {
        this.timeout(5000);
        const { statusCode, body } = await requester
            .get('/api/carts');

        console.log('Obtener carritos response:', statusCode, body);
        expect(statusCode).to.be.equal(200);
        // El body es directamente un array de carritos
        expect(body).to.be.an('array');
    });

    it('Ruta: /api/carts/:cid con el método PUT - Actualizar carrito completo', async function() {
        this.timeout(5000);
        const updatedCart = {
            products: [] // Carrito vacío para la prueba
        };

        const { statusCode, body } = await requester
            .put(`/api/carts/${cartId}`)
            .send(updatedCart);

        console.log('Actualizar carrito response:', statusCode, body);
        expect(statusCode).to.be.equal(200);
        expect(body).to.have.property('products');
    });

    it('Ruta: /api/carts con el método DELETE - Eliminar todos los carritos', async function() {
        this.timeout(5000);
        const { statusCode } = await requester
            .delete('/api/carts');

        console.log('Eliminar todos los carritos response:', statusCode);
        // Ajustado para esperar 200 en lugar de 204
        expect(statusCode).to.be.equal(200);
    });
});
