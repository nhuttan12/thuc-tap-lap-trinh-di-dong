# Dockerfile
FROM node:22-alpine

# Cài gcc, make, python3 để compile bcrypt từ source
RUN apk add --no-cache python3 make g++ py3-pip

# rebuild bcrypt từ source
RUN npm install -g node-gyp

WORKDIR /app

COPY package*.json ./

# rebuild lại bcrypt trước khi cài các package khác
RUN npm rebuild bcrypt --build-from-source

#cài dependencies
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]