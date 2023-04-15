import { Router, Request, Response } from 'express';

const router = Router();

router.post('/group/create', (req: Request, res: Response) => {
    res.send('Create group endpoint hit');
});

router.post('/message/create', (req: Request, res: Response) => {
    res.send('Create message endpoint hit');
});

router.get('/messages/:groupId', (req: Request, res: Response) => {
    res.send('Get messages for group id hit');
});

export const messageRouter = router;