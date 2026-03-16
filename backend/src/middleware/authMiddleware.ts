import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add authentication logic here
  next();
};

export default authMiddleware;
