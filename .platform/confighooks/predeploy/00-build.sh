#!/bin/bash
cd /var/app/staging
rm -fr package-lock.json
chown -R webapp. /tmp/npm/cache
npm install -g yarn@1
NODE_ENV=dev yarn install
ln -sf /opt/elasticbeanstalk/node-install/node-v16.15.1-linux-x64/lib/node_modules/@nestjs/cli/bin/nest.js /usr/bin/nest 
yarn build
chown -R webapp. /var/app/staging
