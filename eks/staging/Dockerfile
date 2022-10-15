FROM node:12-alpine3.12

WORKDIR /var/www/api

COPY . .

RUN npm install && \ 
    npm run build


CMD ["node", "./dist/main.js"]
