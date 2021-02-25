import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@elalemtickets/common';

import { User } from '../models/user';

const router = Router();

router.post('/api/users/signup',
  body('email').isEmail().normalizeEmail().withMessage('must be email'),
  body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('email in use');
    }

    const user = User.build({
      email,
      password
    });

    await user.save();

    const userJWT = jwt.sign({
      id: user._id,
      email: user.email,
    }, process.env.JWT_KEY || '', {
      expiresIn: '1h'
    });

    req.session = {
      jwt: userJWT
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
