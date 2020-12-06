FROM node:10.0.0-alpine as builder

WORKDIR /opt/app

COPY ./package.json .
RUN npm install
VOLUME [ "/opt/app/node_modules" ]
COPY . .
RUN npm run build


FROM nginx:stable-alpine
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/dist /usr/share/nginx/html

