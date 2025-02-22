import connectdb from "@/lib/connectdb";
import UserModel, { IMessage } from "@/models/user.model";
import { NextRequest } from "next/server";
import { messageValidationSchema } from "@/schemas/messageSchema";

export async function POST(req: NextRequest) {
    const { username,message,createdAt } = await req.json();
    try {
        await connectdb()
        // const session = await getServerSession(authOptions)
        // const user: User = session?.user as User
        // const userId = user?._id

        const getUser = await UserModel.findOne({username})
        if(!getUser){
            return Response.json({
                message: "User Not Found!",
                success: false,
                error: true,
                data: null
            })
        }
        if(!getUser?.isAcceptingMessages){
            return Response.json({
                message: "User Not Accepting Messages!",
                success: false,
                error: true,
                data: null
            })
        }

        getUser?.messages.push({content:message,createdAt} as IMessage)
        await getUser?.save()

        return Response.json({
            message: "Message Send Successfully!",
            success: true,
            error: false,
            data: getUser?.messages
        })
    } catch (error) {
        console.log("Sending Message Failed!",error)
        return Response.json({
            message: "Sending Message Failed!",
            success: false,
            error: true,
            data: null
        })
    }
}