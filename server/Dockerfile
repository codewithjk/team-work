FROM node:20-bookworm-slim

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
