FROM node:18

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g pnpm && pnpm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN pnpm run build

CMD [ "node", "-r", "dotenv/config", "." ]
