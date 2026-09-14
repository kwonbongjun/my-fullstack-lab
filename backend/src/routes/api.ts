import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '../lib/prisma.js';

const router: Router = Router();

// POST /api/chat/stream - Gemini AI 스트리밍 엔드포인트
router.post('/chat/stream', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured in backend' });
      return;
    }

    // 1. 공식 @google/genai SDK 인스턴스 생성
    const ai = new GoogleGenAI({ apiKey });

    // 2. HTTP 헤더를 Server-Sent Events (SSE) 스트리밍 포맷으로 설정
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    // 3. Gemini 무료 API (gemini-2.5-flash) 스트리밍 호출
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // 4. 조각(chunk) 단위로 클라이언트에 실시간 즉시 전송 (ReadableStream)
    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    // 5. 스트림 완료 신호 전송 및 종료
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Gemini Streaming Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Streaming failed' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
      res.end();
    }
  }
});

// GET /api/users - 사용자 목록 조회
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/users - 사용자 생성
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const user = await prisma.user.create({
      data: { email, name },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Failed to create user:', error);
    if ((error as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /api/db-test - DB 연결 테스트
router.get('/db-test', async (_req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - startTime;

    const userCount = await prisma.user.count();

    res.json({
      status: 'connected',
      latency: `${latency}ms`,
      userCount,
      database: 'Neon Postgres',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('DB connection failed:', error);
    res.status(500).json({
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/hello - 기존 엔드포인트 유지
router.get('/hello', (_req: Request, res: Response) => {
  res.json({ message: 'Hello from the fullstack lab!' });
});

// POST /api/data - 기존 엔드포인트 유지
router.post('/data', (req: Request, res: Response) => {
  const { data } = req.body;
  res.json({
    received: true,
    data: data,
    timestamp: new Date().toISOString(),
  });
});

export default router;

