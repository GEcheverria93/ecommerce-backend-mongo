// Importamos mongoose para interactuar con MongoDB
const mongoose = require('mongoose');
// Importamos dotenv para manejar variables de entorno
const dotenv = require('dotenv');

// Cargamos las variables de entorno del archivo .env
dotenv.config();

// Definimos una función asíncrona para conectar a la base de datos
const connectDB = async () => {
    try {
        // Intentamos establecer conexión con MongoDB usando la URI definida en las variables de entorno
        await mongoose.connect(process.env.MONGO_DB_URI);
        // Si la conexión es exitosa, mostramos mensaje en consola
        console.log('Conectado a la base de datos');
    } catch (error) {
        // Si ocurre un error durante la conexión
        console.error('Error al conectar a la base de datos:', error);
        // Terminamos el proceso con código de error (1)
        process.exit(1); // Salir del proceso si hay un error
    }
};

// Exportamos la función para poder utilizarla en otros archivos
module.exports = connectDB;
