FROM node:12

ENV NODE_ENV production
ENV PORT 8090
ENV DEBUG true
ENV DATABASE_URL "mongodb://localhost:27017"
ENV DATABASE_NAME "app-test-api"
ENV JWT_SECRET_KEY "a secret key to change"
ENV JWT_EXPIRATION_SECONDS 3600

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

COPY . .

EXPOSE 8080
RUN npm run build

CMD ["node", "dist/"]
