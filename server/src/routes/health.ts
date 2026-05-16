import { Router, Request, Response } from 'express'

export const healthRouter = Router()

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Laporan JAVA & MJP Backend',
    timestamp: new Date().toISOString(),
  })
})
