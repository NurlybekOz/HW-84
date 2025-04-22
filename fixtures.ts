import mongoose from "mongoose";
import config from "./config";


const run = async() => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('tasks');
    } catch (error) {
        console.log('Collection were not present, skipping drop');
    }
    await db.close()
}

run().catch(console.error);