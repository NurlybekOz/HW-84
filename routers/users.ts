import express from 'express';

import { Error } from 'mongoose';
import User from "../modules/User";

const usersRouter = express.Router();
usersRouter.post('/', async (req, res, next) => {

    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });
        user.generateToken();
        await user.save();
        res.send(user);
    } catch (error) {

        if (error instanceof Error.ValidationError) {
            res.status(400).send(error)
            return
        }
        next(error);
    }

});
usersRouter.post('/sessions', async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
        res.status(400).send({error: 'Username not found'});
        return
    }
    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
        res.status(400).send({error: 'Password is wrong'});
        return
    }

    user.generateToken();
    await user.save();

    res.send({message: 'Username and password correct!', user});

});



export default usersRouter;