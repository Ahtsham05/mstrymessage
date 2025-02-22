"use client"
import { useDebounce } from "@uidotdev/usehooks";
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signupValidationSchema } from "@/schemas/signupSchema"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios, { AxiosError } from 'axios'
import { useToast } from "@/hooks/use-toast"
import { apiResponse } from '@/types/apiResponse'
import { useRouter } from 'next/navigation'
import { LoadingTwotoneLoop } from "@/icons/LoadingTwotoneLoop";
import Link from "next/link";

const page = () => {
    const route = useRouter()
    const { toast } = useToast()
    const [userName , setUserName] = useState("")
    const [userNameError, setUserNameError] = useState("")
    const [usernameChecking, setUsernameChecking] = useState(false)

    const debouncedSearchTerm = useDebounce(userName, 300);

    const form = useForm<z.infer<typeof signupValidationSchema>>({
        resolver: zodResolver(signupValidationSchema),
        defaultValues: {
          username: "",
          email: "",
          password: "",
        },
    })
    const submitHandler = async (data : z.infer<typeof signupValidationSchema>)=>{
        try {
            const response = await axios.post('/api/auth/signup',data)
            const { data : responseData } = response
            if(responseData.success){
                toast({
                    title: "Success",
                    description: responseData.message,
                })
                route.push(`/verify-email/${responseData.data.username}`)
            }else{
                toast({
                    title: "Error",
                    description: responseData.message,
                })
            }
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<apiResponse>
            toast({
                title: "Error",
                description: axiosError?.response?.data?.message || "Something went wrong",
            })
        }
    }

    const usernameUniqueCheck = async () => {
        try {
            setUsernameChecking(true)
            const response = await axios.get(`/api/check-username-unique?username=${userName}`)
            const { data : responseData } = response
            console.log("responseData.success",responseData)
            if(responseData.success){
                setUserNameError("✅ Username is available")
                toast({
                    title: "Success",
                    description: "✅ Username is available",
                })
            }else{
                setUserNameError("❌ Username is already taken")
                toast({
                    title: "Error",
                    description: "❌ Username is already taken",
                })
            }
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<apiResponse>
            setUserNameError("")
            toast({
                title: "Error",
                description: axiosError?.response?.data?.message || "Something went wrong",
            })
        } finally {
            setUsernameChecking(false)
        }
    }

    useEffect(()=>{
        if(debouncedSearchTerm){
            usernameUniqueCheck()
        }
    },[debouncedSearchTerm])
  return (
    <div className='min-h-[86vh] bg-gray-100 w-full flex items-center justify-center p-4'>
        <div className='max-w-md w-full bg-white rounded shadow-md p-4 py-10'>
            <h1 className='text-3xl capitalize font-bold tracking-normal text-center text-neutral-800'>Signup</h1>
            <Form {...form}>
                <form className='grid gap-4 mt-5' onSubmit={form.handleSubmit(submitHandler)}>
                    <div>
                        <FormField
                        name="username"
                        control={form.control}
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter Username' onChange={(e)=>{
                                        field.onChange(e)
                                        setUserName(e.target.value)
                                    }}/>
                                </FormControl>
                                {
                                    usernameChecking ? (
                                    <span className="flex gap-2 pt-2">
                                        <LoadingTwotoneLoop width={20} height={20}/> username checking ...
                                    </span>
                                    ) :
                                        userNameError && (
                                            <span className={`${userNameError === '✅ Username is available' ? 'text-green-500':'text-red-500'} flex pt-2`} >{userNameError}</span>
                                        )
                                }
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div>
                        <FormField
                        name="email"
                        control={form.control}
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type='email' placeholder='Enter Email' {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <div>
                        <FormField
                        name="password"
                        control={form.control}
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>password</FormLabel>
                                <FormControl>
                                    <Input type='password' id='password' placeholder='password' {...field}/>

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button type="submit" className='mt-2'>Submit</Button>
                </form>
            </Form>
            <div className='text-center mt-4'>
                <span className='text-sm text-gray-500'>Already have an account? </span>
                <Link href={'/signin'} className='text-blue-500 hover:text-blue-600'>Signin</Link>
            </div>
        </div>
    </div>
  )
}

export default page