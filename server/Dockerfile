FROM node:alpine

WORKDIR /opt/app
COPY ./package.json ./
RUN npm install
COPY . .
VOLUME [ "/opt/app/node_modules" ]
CMD ["npm", "run", "start"]