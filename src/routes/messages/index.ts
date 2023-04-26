import { Router, Request, Response } from 'express';
import { ChatGroup, User } from '../../models';
import { Members } from '../../models/ChatGroup';

const router = Router();

router.get('/group/:groupId', (req: Request, res: Response): void => {
    const { groupId } = req.params;

    const chatGroupPromise = ChatGroup.findById(groupId);

    chatGroupPromise.then((chatGroup) => {
        return res.send({
            chatGroup,
        }).status(200);
    }).catch(err => res
        .send({err})
        .status(500)
    ); 
});

router.post('/group/:groupId/add-member/:userId', (req: Request, res: Response): void => {
    const { groupId, userId } = req.params;

    const addMemberToGroup = ChatGroup.updateOne(
        { _id: groupId },
        { $addToSet: { members: userId }}
    );

    const addUserToGroup = User.updateOne({ _id: userId }, { $addToSet: { groups: groupId }});

    Promise.all([addMemberToGroup, addUserToGroup])
        .then((values) => {
            const [group, user] = values;
            
            res.send({
                group,
                user,
            }).status(200);
        })
        .catch(err => {
            res.send({
                err
            }).status(500);
        })
});

router.post('/group/create', (req: Request, res: Response) => {
    const { name, userId } = req.body;

    if (!name || !userId) {
        return res.send({
            'message': 'Please provide both a name for the chat group, & a user ID'
        }).status(400);
    }

    const chatGroup = new ChatGroup({
        name,
    });

    chatGroup.save()
        .then(chatGroup => {
            const addUserToMembers = ChatGroup.updateOne(
                {_id: chatGroup._id},
                { $addToSet: { members: userId }}
            );

            const addUserToChatGroup = User.updateOne(
                {_id: userId}, 
                { $addToSet: { groups: chatGroup._id }}
            );

            Promise.all([addUserToMembers, addUserToChatGroup])
                .then(() => {
                    res.send({
                        message: 'Your group has been created',
                        chatGroup,
                    }).status(200);
                })
                .catch(err => {
                    res.send({
                        err
                    }).status(500);
                })
        })
        .catch(err => {
            return res.send({
                err,
            }).status(500);
        });
});

router.post('/message/create', (req: Request, res: Response) => {
    res.send('Create message endpoint hit');
});

router.get('/messages/:groupId', (req: Request, res: Response) => {
    res.send('Get messages for group id hit');
});

export const messageRouter = router;