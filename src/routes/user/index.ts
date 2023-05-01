import { Router, Request, Response } from 'express';
import { User } from '../../models';
import bcrypt from 'bcrypt';
import { signToken } from '../middleware/authentication';

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

router.post('/sign-in', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        res.send({
            message: `User with the username "${username}" not found`,
        }).status(404);
        return;
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (!doesPasswordMatch) {
        res.send({
            message: 'Your password is incorrect. Please try again',
        }).status(400);
    }

    const token = signToken(user._id);

    res.send({
        token,
        username: user.username,
        email: user.email,
    });
});

export const userRouter = router;