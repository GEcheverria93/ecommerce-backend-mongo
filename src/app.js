const express = require('express');
const cors = require('cors');
const exphbs = require('express-handlebars');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const viewsRoutes = require('./routes/views.router');
const connectDB = require('./db');

const app = express();

// Conectar a la base de datos
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// Configuración de Handlebars con extensión '.hbs'
app.engine(
    '.hbs',
    exphbs.engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        partialsDir: path.join(__dirname, 'views', 'partials'),
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
        helpers: {
            calculateTotal: (products) =>
                products.reduce(
                    (total, product) =>
                        total + product.product.price * product.quantity,
                    0
                ),
            eq: (a, b) => a === b,
        },
    })
);

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views')); // Define la carpeta 'views'
app.set('view engine', '.hbs'); // Configura el motor de vistas para usar .hbs

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la api
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);

// Rutas para las vistas
app.use('/', viewsRoutes);

module.exports = app;
