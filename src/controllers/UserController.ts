import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import User from '../app/models/User'

class UserController {
  async store(req: Request, res: Response) {
    const repository = getRepository(User);
    const { email, password } = req.body;

    const userExists = await repository.findOne({ where: { email } });

    if (userExists) {
      res
        .status(409)
        .json({
          message: 'User already exists!'
        })
      return
    }

    const user = repository.create({
      email,
      password
    });
    await repository.save(user);

    res
      .status(201)
      .json(user);
    return
  }

  async index(req: Request, res: Response) {
    res
      .status(200)
      .send({ id: req.userId })
    return
  }
}

export default new UserController();
