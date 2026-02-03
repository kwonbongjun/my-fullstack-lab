import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

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
