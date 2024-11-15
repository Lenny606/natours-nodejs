FROM node:14
LABEL authors="thomas"

WORKDIR /app
COPY app.js .
COPY server.js .
COPY public ./public
COPY package.json .

RUN npm install

EXPOSE 3000
#  docker build -t myapp:1.0 .
#  docker run -p 3000:3000 myapp:1.0
CMD ["node", "server.js"]