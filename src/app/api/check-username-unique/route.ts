import { z } from "zod";
import connectdb from "@/lib/connectdb";
import UserModel from "@/models/user.model";
import { usernameValidationSchema } from "@/schemas/signupSchema";
import { NextRequest,NextResponse } from "next/server";

const usernameValidate = z.object({
    username: usernameValidationSchema
})

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url)

    const queryParams = {
        username : searchParams.get("username")
    }

    // const result = usernameValidate.safeParse({username})
    const result = usernameValidate.safeParse(queryParams)

    if (!result.success) {
        const userError = result.error?.format()?.username?._errors || []
        return Response.json({
            message: userError[0],
            success: false,
            data: null,
            error: true
        },{status:400})
    }

    try {
        await connectdb()
        
        const existedUserByUsername = await UserModel.findOne(queryParams)
        if(existedUserByUsername) {
            return Response.json({
                message: "Username already exists",
                success: false,
                data: null,
                error: true
            }, { status: 400 })
        }

        return Response.json({
            message: "Username is valid",
            success: true,
            data: null,
            error: false
        },{status:200})

    } catch (error) {
        console.error("Failed to validate username",error)
        return Response.json({
            message: "Failed to validate username",
            success: false,
            data: null,
            error: true
        },{status:500})
    }
}