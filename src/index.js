// Importamos dotenv para manejar variables de entorno
const dotenv = require('dotenv');
// Importamos nuestra aplicación Express configurada
const app = require('./app');

// Cargamos las variables de entorno del archivo .env
dotenv.config();

// Definimos el puerto del servidor, usando el de .env o 8080 por defecto
const PORT = process.env.PORT || 8080;

// Iniciamos el servidor y mostramos mensaje en consola
app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`);
});
