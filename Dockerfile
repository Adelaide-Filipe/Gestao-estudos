# Imagem leve (Alpine) para ser otimizada
FROM node:18-alpine

# Pasta de trabalho
WORKDIR /app

# Copia as dependências e instala
COPY package*.json ./
RUN npm install --production

# Copia o resto do código
COPY . .

# Expõe a porta 3000
EXPOSE 3000

CMD ["node", "/app/src/server.js"]