import connectdb from "@/lib/connectdb";
import UserModel from "@/models/user.model";
import { NextRequest } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import {acceptMessageValidationSchema} from "@/schemas/acceptMessageSchema"

export async function POST(req : NextRequest){
    const { isAcceptingMessages } = await req.json()
    console.log("isAcceptingMessages", isAcceptingMessages)
    try {
        await connectdb()
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if(!session || !session?.user){
            return Response.json({
                message: "Not authenticated",
                success: false,
                data: null,
                error: true
            })
        }

        const userId = user?._id

        const response = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessages
        },{new:true})
        if(!response){
            return Response.json({
                message: "Failed to accept messages",
                success: false,
                data: null,
                error: true
            })
        }

        return Response.json({
            message: "Accept Message Update Success!",
            success: true,
            data: {
                isAcceptingMessages: response.isAcceptingMessages
            },
            error: false
        })
    } catch (error) {
        console.error("accepting messages Failed!", error)
        return Response.json({
            message: "Failed to accept messages",
            success: false,
            data: null,
            error: true
        })
    }
}

export async function GET(req : NextRequest){
    try {
        await connectdb()
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
        if(!session || !session?.user){
            return Response.json({
                message:"Not Authenticating!",
                success:false,
                error:true,
                data:null
            })
        }

        const userId = user?._id

        const response = await UserModel.findById(userId)
        if(!response){
            return Response.json({
                message: "Invalid User Id!",
                success:false,
                error:true,
                data:null
            })
        }

        return Response.json({
            message: "get isAcceptingMessages Successfully!",
            error:false,
            success:true,
            data:{
                isAcceptingMessages: response.isAcceptingMessages
            }
        })
    } catch (error) {
        console.error("Get accepting Messages",error)
        return Response.json({
            message: "Get Accept Messages Failed!",
            success:false,
            error:true,
            data:null
        })
    }
}