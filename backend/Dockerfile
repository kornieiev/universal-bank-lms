FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5001

CMD ["sh", "-c", "npm run migrate && npm run seed && node dist/src/main.js"]