#  docker-compose로 로컬 개발할 때 docker-compose up 한 번으로 프론트/백엔드를 동시에 띄우기 위한 용도입니다.
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]


# #next.js ssr cloudrun은 아래와 같이 설정 바꾸면될까?
# # 1. base
# FROM node:18-alpine AS base

# # 2. deps
# FROM base AS deps
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install --production

# # 3. builder
# FROM base AS builder
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# # 4. runner
# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production

# # standalone 복사
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static
# COPY --from=builder /app/public ./public

# EXPOSE 8080

# CMD ["node", "server.js"]