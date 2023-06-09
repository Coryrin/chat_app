import { Router, Request, Response } from 'express';
import { ChatGroup, Message, User } from '../../models';
import { checkAuthenticationToken } from '../middleware/authentication';
import { pusher } from '../../services/channels';

const router = Router();

router.get('/group/:groupId', (req: Request, res: Response): void => {
    const { groupId } = req.params;

    const chatGroupPromise = ChatGroup.findById(groupId).populate(['messages', 'members']);

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

router.post('/group/create', checkAuthenticationToken, (req: Request, res: Response) => {
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

            addUserToMembers
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

router.post('/:groupId/create', checkAuthenticationToken, (req: Request, res: Response) => {
    const { groupId } = req.params;
    const {
        content,
        author,
    } = req.body;

    new Message({
        content,
        author,
        chatGroup: groupId
    })
        .save()
        .then((message) => {
            message.populate('author').then(populatedMessage => {
                ChatGroup.findByIdAndUpdate(groupId, {
                    $push: {
                        messages: {
                            _id: message._id
                        }
                    }
                }).then(() => {
                    pusher.trigger(groupId, 'message-sent', {
                        message: populatedMessage
                    });
                });
    
                res.send({
                    message: populatedMessage,
                });
            });           
        });
});

router.get('/:userId/groups', checkAuthenticationToken, (req: Request, res: Response) => {
    const { userId } = req.params;

    ChatGroup.find({
        members: userId
    })
    .populate(['members', 'messages'])
    .then((chatGroups) => {
        res.send({
            chatGroups,
        });
    })
});

export const messageRouter = router;
