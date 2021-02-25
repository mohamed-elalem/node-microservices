import { Router } from 'express';

const router = Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;

  res.sendStatus(200);
});

export { router as signoutRouter };
