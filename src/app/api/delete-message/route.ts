import connectdb from "@/lib/connectdb";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req : Request){
    const {  messageId } = await req.json()
    const session = await getServerSession(authOptions)
    const username = session?.user?.username


    if(!username || !messageId){
        return Response.json({
            message: "unAuthentication!",
            success: false,
            data: null,
            error: true
        })
    }
    try {
        await connectdb()
        const user = await UserModel.updateOne(
        { username }, 
        {
            $pull: {
                messages : {_id: messageId}
            }
        },
        { new: true })

        if(!user){
            return Response.json({
                message: "User not found!",
                success: false,
                data: null,
                error: true
            })
        }

        if(user.modifiedCount > 0){
            return Response.json({
                message: "Message deleted successfully",
                success: true,
                data: null,
                error: false
            })
        }else{
            return Response.json({
                message: "Message not found or Already Deleted!",
                success: false,
                data: null,
                error: true
            })
        }
        
    } catch (error) {
        return Response.json({
            message : "Failed to delete message",
            success: false,
            data: null,
            error: true
        })
    }
}