import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('api/hello')
  getHello() {
    return { message: 'Hello from NestJS backend!' };
  }

  @Get('api/db-test')
  async getDbTest() {
    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;
      const userCount = await this.prisma.user.count();

      return {
        status: 'connected',
        latency: `${latency}ms`,
        userCount,
        database: 'Postgres',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'disconnected',
        error: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('api/data')
  postData(@Body() body: { data: any }) {
    return {
      received: true,
      data: body.data,
      timestamp: new Date().toISOString(),
    };
  }
}
