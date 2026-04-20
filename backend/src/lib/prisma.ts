import { PrismaClient } from "@prisma/client";

//hmr 때문에 개발서버에서는 PrismaClient 인스턴스가 여러 개 생성되는 것을 방지하기 위한 코드
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
