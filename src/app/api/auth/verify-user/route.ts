import { NextRequest } from "next/server";
import UserModel from "@/models/user.model";
import connectdb from "@/lib/connectdb";
import { verifyValidationSchema } from "@/schemas/verifySchema";


export async function POST(req: NextRequest) {

    const { username, code} = await req.json();

    const decodedUsername = decodeURIComponent(username);
    const result = verifyValidationSchema.safeParse({code})
    if(!result.success){
        const error = result.error?.format()?.code?._errors || []
        return Response.json({
            message: error[0],
            success: false,
            data: null,
            error: true
        },{status:404})
    }

    try {
        await connectdb()

        const userExist = await UserModel.findOne({username : decodedUsername})
        if(!userExist){
            return Response.json({
                message: "User not found",
                success: false,
                data: null,
                error: true
            },{status:404})
        }

        if(userExist.verifyCode !== code){
            return Response.json({
                message: "Invalid Verification Code",
                success: false,
                error: true,
                data: null
            })
        }

        if(new Date(userExist.verifyCodeExpiry) < new Date()){
            return Response.json({
                message: "OTP Expired, signup again for get new OTP!",
                error: true,
                success: false,
                data: null
            })
        }
        
        userExist.isVerified = true
        await userExist.save()

        return Response.json({
            message: "User verified successfully!",
            success: true,
            data: null,
            error: false
        })
    } catch (error) {
        console.error("Verify User Failed!",error)
        return Response.json({
            message: "Failed to verify User",
            success: false,
            data: null,
            error: true
        },{status:404})
    }
}