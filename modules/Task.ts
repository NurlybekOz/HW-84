
import mongoose from "mongoose";
import User from "./User";

const Schema = mongoose.Schema

const TaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
            validator: async (value: string) => {
                const user = await User.findById(value)
                return !!(user);
            },
            message: 'User not found',
        },
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['new', 'in progress', 'done'],
        required: true,
    }
})

const Task = mongoose.model('Task', TaskSchema);
export default Task;