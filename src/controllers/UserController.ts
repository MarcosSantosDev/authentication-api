import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import User from '../app/models/User'

class UserController {
    async store(req: Request, res: Response) {
        const repository = getRepository(User);
        const { email, password } = req.body;
    
        const userExists = await repository.findOne({ where: { email } });

        if (userExists) {
            return res.sendStatus(409)
        }

        const user = repository.create({
            email,
            password
        });
        await repository.save(user);

        return res.json(user);
    }

    async index(req: Request, res: Response) {
        return res.send({
            userID: req.userId
        })
    }
}

export default new UserController();