FROM node:11.14.0-alpine
RUN npm install
EXPOSE 3000
CMD [ "npm", "start"]