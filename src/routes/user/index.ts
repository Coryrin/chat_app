import { Router, Request, Response } from 'express';
import { User } from '../../models/User';

const router = Router();

router.post('/create', (req: Request, res: Response) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.send({
            message: 'Username, password, & an email are required.'
        }).status(400);
    }

    const user = new User({
        username,
        password,
        email
    });

    return user.save()
        .then((user) => res.send({
            message: 'User has successfully been created',
            user,
        }))
        .catch((err) => {
            res.send({
                message: err
            }).status(500);
        });
});

router.post('/signin', (req: Request, res: Response) => {
    res.send('User sign in endpoint hit!');
});

export const userRouter = router;