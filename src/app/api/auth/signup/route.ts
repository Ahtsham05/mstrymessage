import { NextRequest } from "next/server";
import connectdb from "@/lib/connectdb";
import UserModel from "@/models/user.model";
import {signupValidationSchema} from "@/schemas/signupSchema";
import bcrypt from 'bcryptjs'
import { emailVerification } from "../../../../../emails/emailVerification"
import { sendMail } from "@/helpers/sendMail";


export async function POST(req:NextRequest){
    const { username , email , password } = await req.json()

    const result = signupValidationSchema.safeParse({username, email, password});
    if(!result.success){
        const error = result.error?.format()
        return Response.json({
            success: false,
            error: true,
            data: null,
            message: error?.email?._errors[0] || error?.password?._errors[0] || error?.username?._errors[0]
        },{status:404})
    }

    try {
        await connectdb()

        const userExited = await UserModel.findOne({username})
        if(userExited){
            return Response.json({
                message: "Username Already Taken!",
                success: false,
                error: true,
                data: null
            },{status:400})
        }

        const emailExist = await UserModel.findOne({email})
        if(emailExist){
            if(emailExist.isVerified){
                return Response.json({
                    message: "Already Registered Email!",
                    success: false,
                    error: true,
                    data: null
                },{status:400})
            }else{
                const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
                const createdAt = Date.now(); // Current timestamp in milliseconds
                const expiryTime = 60 * 60 * 1000; // 1 hour in milliseconds
                const verifyCodeExpiry = createdAt + expiryTime;

                const hashPassword = await bcrypt.hash(password,10);

                emailExist.username = username
                emailExist.password = hashPassword
                emailExist.verifyCode = verifyCode
                emailExist.verifyCodeExpiry = new Date(verifyCodeExpiry)
                await emailExist.save()

                const subject = "Mstry Message Verification OTP"
                const react = emailVerification({username,verifyCode})
                const emailResponse = await sendMail({email,subject,react})

                if(!emailResponse){
                    return Response.json({
                        message:"Failed To Send Verification Code Signup Again",
                        success: false,
                        error: true,
                        data: null
                    },{status:200})
                }

                return Response.json({
                    message:"User Registered successfully! verify your account!",
                    success: true,
                    error: false,
                    data: emailExist
                },{status:200})
            }
        }else{
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            const createdAt = Date.now(); // Current timestamp in milliseconds
            const expiryTime = 60 * 60 * 1000; // 1 hour in milliseconds
            const verifyCodeExpiry = createdAt + expiryTime;
            const hashPassword = await bcrypt.hash(password,10);
            const newUser = new UserModel({
                username,
                email,
                password:hashPassword,
                verifyCode:verifyCode,
                verifyCodeExpiry:new Date(verifyCodeExpiry),
                isVerified:false,
                isAcceptingMessages:true,
                messages:[]
            })
            await newUser.save()

            
            const subject = "Mstry Message Verification OTP"
            const react = emailVerification({username,verifyCode})
            const emailResponse = await sendMail({email,subject,react})

            if(!emailResponse){
                return Response.json({
                    message:"Failed To Send Verification Code Signup Again",
                    success: false,
                    error: true,
                    data: null
                },{status:200})
            }

            return Response.json({
                message: "User Registered successfully! verify your account!",
                success: true,
                error: false,
                data: newUser
            },{status:200})
        }
    } catch (error) {
        console.error("Failed to Register User",error)
        return Response.json({
            message: "Failed to register user",
            success: false,
            error: true,
            data: null
        },{status:500})
    }
}