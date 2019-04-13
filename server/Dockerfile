FROM node:11.14.0-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
RUN npm run start
EXPOSE 3000
CMD [ "npm", "start"]