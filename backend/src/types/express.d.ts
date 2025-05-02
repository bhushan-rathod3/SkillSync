import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      originalFilename?: string;
      user?: {
        id: number;
        role: string;
        [key: string]: any;
      };
    }
  }
}
