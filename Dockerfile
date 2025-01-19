# Dockerfile for Express API server
FROM node
WORKDIR /
COPY package.json /
RUN npm install
COPY . /
CMD ["npm", "start"]