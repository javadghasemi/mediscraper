FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --omit=dev

# Bundle app source
COPY . .

CMD [ "node", "index.js" ]