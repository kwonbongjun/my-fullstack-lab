# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
# yarn install 시 @prisma/client의 postinstall 훅이 schema.prisma를 필요로 하므로 미리 복사
COPY prisma ./prisma/
RUN yarn install --frozen-lockfile

COPY . .
#  Prisma 클라이언트 생성해야 함수 사용 가능
RUN yarn prisma:generate
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
# yarn install 시 @prisma/client의 postinstall 훅이 schema.prisma를 필요로 하므로 미리 복사
COPY prisma ./prisma/
#  프로덕션용 의존성 설치 (devDependencies 제외)
RUN yarn install --frozen-lockfile --production
#  빌드 결과물과 Prisma 관련 파일들만 복사
COPY --from=builder /app/dist ./dist
#  production 스테이지에서는 --production 플래그로        
#devDependencies(prisma CLI 등)를 제외하고 설치하기 때문에 prisma:generate를 실행할 수 없음. 
#  그래서 builder에서 이미 생성된 결과물만 복사해옴
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

CMD ["yarn", "start"]
