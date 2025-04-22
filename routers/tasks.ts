import express from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import Task from "../modules/Task";
import {Error} from "mongoose";

const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
   try {
       const user = (req as RequestWithUser).user;

       const newTask = {
           title: req.body.title,
           description: req.body.description,
           status: 'new',
           user: user.id,
       }
       const task = new Task(newTask)
       await task.save()
       res.send(task)
   } catch (error) {
       if (error) {
           if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
               res.status(400).send(error)
               return;
           }


           next(error);
       }
   }


})
tasksRouter.get('/', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const tasks = await Task.find({user: user.id})
        res.send(tasks)
    } catch (e) {
        next(e)
    }

})
tasksRouter.put('/:id', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const {title, description, status} = req.body;
        const TaskId = req.params.id;
        const task = await Task.findOne({_id: TaskId, user: user.id})

        if (!task) {
            res.status(403).send({error: 'You are not allowed to edit this task'})
            return
        }

        task.title = title;
        task.description = description;
        task.status = status;

        await task.save();
        res.send(task)

    } catch (e) {
        next(e)
    }

})
tasksRouter.delete('/:id', auth, async (req, res, next) => {

    try {
        const user = (req as RequestWithUser).user;
        const TaskId = req.params.id;
        const task = await Task.findOne({_id: TaskId, user: user.id})

        if (!task) {
            res.status(403).send({error: 'You are not allowed to delete this task'})
            return
        }

        await Task.deleteOne(task._id);
        res.send('Task deleted successfully')
    } catch (e) {
        next(e)
    }

})



export default tasksRouter;