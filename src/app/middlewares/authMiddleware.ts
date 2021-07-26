import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.sendStatus(401);
  }

  const token = authorization!.replace('Bearer', '').trim();

  try {
    jwt.verify(token, 'access', async (error, user) => {
      if (user) {
        req.userId = user.id
        next()
      } else if (error?.message === 'jwt expired') {
        return res
          .status(403)
          .json({
            status: 403,
            succcess: false,
            message: 'Access token expired'
          });
      } else {
        return res
          .status(403)
          .json({
            status: 403,
            error,
            message: 'User not authenticated'
          })
      }
    });
  } catch {
    return res.sendStatus(401).json({
      status: 401,
    });
  }
}