FROM node:latest

WORKDIR /app

COPY ./article.js /app
COPY ./package*.json /app

RUN npm install

# EXPOSE 3003

CMD ["node", "--trace-warnings", "article.js"]
