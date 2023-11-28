FROM node:latest

WORKDIR /app

COPY ./auth.js /app
COPY ./package*.json /app

RUN npm install

# EXPOSE 3003

CMD ["node", "--trace-warnings", "auth.js"]
