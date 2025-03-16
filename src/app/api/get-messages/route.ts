import connectdb from "@/lib/connectdb";
import UserModel from "@/models/user.model";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(req: NextRequest){
    try {
        await connectdb()

        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if(!session ||!session?.user){
            return Response.json({
                message: "Not authenticated",
                success: false,
                data: null,
                error: true
            })
        }
        const userId = new mongoose.Types.ObjectId(user?._id)

        const userMessages = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind: "$messages"},
            {$sort: { "messages.createdAt": -1}},
            {$group: { _id: "$_id",messages: {$push: "$messages" }  }}
        ]).exec()

        if(!userMessages || userMessages.length === 0){
            return Response.json({
                message: "No messages found",
                success: false,
                data: null,
                error: true
            })
        }

        return Response.json({
            message: "Messages fetched successfully",
            success: true,
            data: userMessages[0].messages,
            error: false
        })
    } catch (error) {
        console.error("Error fetching Messages", error)
        return Response.json({
            message: "Failed to fetch messages",
            success: false,
            data: null,
            error: true
        })
    }
}