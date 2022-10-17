FROM node:lts-alpine3.15
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
# RUN node server.js
CMD ["node", "server.js"]
