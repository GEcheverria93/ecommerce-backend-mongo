const mongoose = require('mongoose');
const supertest = require('supertest');
const connectDB = require('../../src/db');
const app = require('../../src/app');

const requester = supertest(app);

describe('Rutas de Productos (CRUD Operations)', () => {
    let expect;
    let productId;

    before(async () => {
        expect = (await import('chai')).expect;
        await connectDB();
    });

    it('Verificar conexión al servidor', async () => {
        const res = await requester.get('/');
        console.log('Verificar conexión al servidor:', res.status);
        expect(res.status).to.be.oneOf([200, 302, 404]);
    });

    it('Ruta: /api/products con el método POST - Crear nuevo producto', async function () {
        this.timeout(5000);
        const newProduct = {
            title: 'Producto de Prueba',
            code: 'TEST-001',
            price: 999.99,
            description: 'Descripción del producto de prueba',
            category: 'Test',
            stock: 100,
            status: true,
        };

        const { statusCode, body } = await requester
            .post('/api/products')
            .send(newProduct);

        console.log('Crear producto response:', statusCode, body);
        expect(statusCode).to.be.equal(201);
        expect(body).to.have.property('id');

        productId = body.id;
    });

    it('Ruta: /api/products con el método GET - Obtener todos los productos', async function () {
        this.timeout(5000);
        const { statusCode, body } = await requester.get('/api/products');

        console.log('Obtener productos response:', statusCode);
        expect(statusCode).to.be.equal(200);
        expect(body).to.have.property('payload');
        expect(body.payload).to.be.an('array');
    });

    it('Ruta: /api/products/:pid con el método GET - Obtener producto específico', async function () {
        this.timeout(5000);
        const { statusCode, body } = await requester.get(
            `/api/products/${productId}`
        );

        console.log('Obtener producto específico response:', statusCode, body);
        expect(statusCode).to.be.equal(200);
        expect(body).to.have.property('id');
        expect(body.id).to.be.equal(productId);
    });

    it('Ruta: /api/products/:pid con el método PUT - Actualizar producto', async function () {
        this.timeout(5000);
        const updatedProduct = {
            title: 'Producto Actualizado',
            code: 'TEST-002',
            price: 1499.99,
            description: 'Descripción actualizada',
            status: true,
        };

        const { statusCode, body } = await requester
            .put(`/api/products/${productId}`)
            .send(updatedProduct);

        console.log('Actualizar producto response:', statusCode, body);
        expect(statusCode).to.be.equal(200);
        expect(body).to.have.property('title');
        expect(body.title).to.be.equal(updatedProduct.title);
    });

    it('Ruta: /api/products/:pid con el método DELETE - Eliminar producto', async function () {
        this.timeout(5000);
        const { statusCode, body } = await requester.delete(
            `/api/products/${productId}`
        );

        console.log('Eliminar producto response:', statusCode);
        expect(statusCode).to.be.equal(204);
    });
});
