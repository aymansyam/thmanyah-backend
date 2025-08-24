FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i
COPY index.js .
ENV PORT=8080 AUTH_URL=http://auth:8081 STORE_URL=http://store:8082
EXPOSE 8080
CMD ["npm","start"]
