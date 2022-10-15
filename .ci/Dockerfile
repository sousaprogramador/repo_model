# FROM node:14 as builder
# ENV NODE_ENV=development
# RUN mkdir -p /home/app
# WORKDIR /home/app
# COPY . .
# RUN yarn install
# RUN yarn build

# FROM node:14-alpine as runner
# ENV NODE_ENV=production
# RUN mkdir -p /var/www/api
# WORKDIR /var/www/api
# COPY --from=builder /home/app/package*.json /home/app/yarn.* ./
# COPY --from=builder /home/app/dist/ ./dist/
# COPY --from=builder /home/app/.env ./.env
# COPY --from=builder /home/app/knexfile.js ./knexfile.js
# RUN yarn install
# CMD ["yarn", "start:prod"]

FROM node:14
ENV NODE_ENV=development
RUN mkdir -p /var/www/api
WORKDIR /var/www/api

COPY . .

COPY package*.json ./

RUN npm install && \
    npm run build

CMD ["npm", "run", "start:prod"]