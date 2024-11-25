# Usa la imagen oficial de Node.js como base
FROM node:18

# Configura el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar las dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Compila la aplicación para producción
RUN npm run build

# Expone el puerto 3001 dentro del contenedor
EXPOSE 3001

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start"]
