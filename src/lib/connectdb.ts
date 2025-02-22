import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number | string
}

const connection: connectionObject = {}

const connectdb = async () => {
    if(connection.isConnected) return;
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '' , {});
        connection.isConnected = db.connection.readyState;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(`Failed to connect to MongoDB: ${error}`);
        process.exit(1);
    }
}

export default connectdb;