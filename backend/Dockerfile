# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile --ignore-engines

COPY . .
RUN yarn prisma:generate
RUN yarn build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

COPY package.json yarn.lock ./
COPY prisma ./prisma/
# 프로덕션용 의존성 설치 (--ignore-engines 플래그로 node 엔진 버전 엄격 체크 우회)
RUN yarn install --frozen-lockfile --production --ignore-engines

# 빌드 결과물과 생성된 Prisma 클라이언트 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 5000

CMD ["yarn", "start"]
