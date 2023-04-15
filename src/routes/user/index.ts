import { Router, Request, Response } from 'express';

const router = Router();

router.post('/create', (req: Request, res: Response) => {
    res.send('User creation endpoint hit!');
});

router.post('/signin', (req: Request, res: Response) => {
    res.send('User sign in endpoint hit!');
});

export const userRouter = router;