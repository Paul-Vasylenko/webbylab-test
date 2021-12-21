FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install --save sqlite3
COPY . .
CMD [ "npm", "start" ]