import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../app/models/User';

const TOKEN_EXPIRES_IN = 60000;
const TOKEN_SECRET = 'access'
const REFRESH_TOKEN_SECRET = 'refresh'

class AuthController {
  private handleTokens = (id: string) => {
    const payload = { id };
    const token = jwt.sign(payload, TOKEN_SECRET, {
      expiresIn: `${TOKEN_EXPIRES_IN}ms`
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: '1d'
    });

    return { token, refreshToken }
  }

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.refresh_token;

    if (!refreshToken) {
      res
        .status(403)
        .json({
          message: 'Refresh token not found, login again'
        });
      return
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (error: any, user: any) => {
      if (!error) {
        const { token, refreshToken } = this.handleTokens(user.id)

        res
          .status(200)
          .json({
            token,
            refreshToken,
          })
        return
      } else {
        res
          .status(403)
          .json({
            message: 'Invalid refresh token'
          })
        return
      }
    });
  }

  authenticate = async (req: Request, res: Response) => {
    const repository = getRepository(User);
    const { email, password } = req.body;

    const user = await repository.findOne({ where: { email } });

    if (!user) {
      res
        .status(401)
        .json({
          message: 'email or password is wrong!',
        });
      return
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res
        .status(401)
        .json({
          message: 'email or password is wrong!',
        });
      return
    }

    const { token, refreshToken } = this.handleTokens(user.id)

    res
      .status(200)
      .json({
        user: {
          id: user.id,
          email: user.email
        },
        token,
        refreshToken,
      });
    return
  }
}

export default new AuthController();
