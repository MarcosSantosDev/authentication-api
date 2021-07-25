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
        const refreshToken = req.body.token;

        if (!refreshToken) {
            return res.json({
                message: 'Refresh token not found, login again'
            });
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (error: any, user: any) => {
            if (!error) {
                const { token, refreshToken } = this.handleTokens(user.id)

                return res.json({
                    success: true,
                    token,
                    refreshToken
                })
            } else {
                return res.json({
                    success: false,
                    message: 'Invalid refresh token'
                })
            }
        });
    }

     authenticate = async (req: Request, res: Response) => {
        const repository = getRepository(User);
        const { email, password } = req.body;

        const user = await repository.findOne({ where: { email } });

        if (!user) {
            return res.sendStatus(401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.sendStatus(401);
        }

        const { token, refreshToken } = this.handleTokens(user.id)

        return res.json({
            user: {
                id: user.id,
                email: user.email
            },
            token,
            refreshToken,
            expiresIn: TOKEN_EXPIRES_IN,
        });
    }
}

export default new AuthController();
