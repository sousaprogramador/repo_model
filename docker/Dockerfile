FROM node:14

WORKDIR /home/node/app

COPY package*.json ./

COPY . .

EXPOSE 3333

CMD npm install --ignore-scripts=false --verbose sharp && npm install && npm run dev
