# Usa una imagen base oficial de Node.js
FROM node:18.20.5

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Reinstala bcrypt para asegurar la compatibilidad
RUN npm rebuild bcrypt

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 8080

# Define el comando de inicio
CMD ["npm", "start"]
