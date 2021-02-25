import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@elalemtickets/common';

import { User } from '../models/user';
import { Password } from '../services/password';

const router = Router();

router.post(
  '/api/users/signin',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().not().isEmpty().withMessage('Password must not be empty'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(existingUser.password, password);

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    const userJWT = jwt.sign({
      id: existingUser._id,
      email: existingUser.email,
    }, process.env.JWT_KEY || '', {
      expiresIn: '1h'
    });

    req.session = {
      jwt: userJWT
    };

    res.send(existingUser);
  });

export { router as signinRouter };
