const express = require('express');
const cors = require('cors');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const viewsRoutes = require('./routes/viewsRoutes');
const connectDB = require('./db');
const initializePassport = require('./config/passportConfig');
const sessionRoutes = require('./routes/sessionRoutes');
const mocksRouter = require('./routes/mocks.router'); // Import the new router
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');

const app = express();

// Connect to the database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

// Handlebars configuration with '.hbs' extension
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
            gt: (a, b) => a > b,
            lt: (a, b) => a < b,
            inc: (value) => value + 1,
            dec: (value) => value - 1,
        },
    })
);

// View engine configuration
app.set('views', path.join(__dirname, 'views')); // Define the 'views' folder
app.set('view engine', '.hbs'); // Configure the view engine to use .hbs

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/mocks', mocksRouter); // Register the new router
app.use('/api', userRoutes); // Register the user router
app.use('/api/pets', petRoutes); // Register the pet router

// View routes
app.use('/', viewsRoutes);

module.exports = app;
