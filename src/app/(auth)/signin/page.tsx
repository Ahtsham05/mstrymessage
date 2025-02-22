"use client"
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { redirect, useRouter } from 'next/navigation'
import { loginSchema } from "@/schemas/loginSchema";
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

const page = () => {
    const route = useRouter()
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
          email: "",
          password: "",
        },
    })
    const submitHandler = async (data : z.infer<typeof loginSchema>)=>{
        try {
            const result:any = await signIn("credentials",{
              email: data.email,
              password: data.password,
              redirect: false,
            })
            
            if(result?.ok){
              toast({
                title:"Success",
                description: "Logged in successfully",
              })
              route.push("/dashboard")
            }else{
              toast({
                title: "error",
                description: result?.error
              })
            }
        } catch (error) {
            console.error("error",error)
        }
    }

  return (
    <div className='bg-gray-100 h-[86vh] w-full flex items-center justify-center p-4'>
        <div className='max-w-md w-full bg-white rounded shadow-md p-4 py-10'>
            <h1 className='text-3xl capitalize font-bold tracking-normal text-center text-neutral-800'>Signin</h1>
            <Form {...form}>
                <form className='grid gap-4 mt-5' onSubmit={form.handleSubmit(submitHandler)}>
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
                    <Button type="submit" className='mt-2'>Signin</Button>
                </form>
            </Form>
            <div className='text-center mt-4'>
                <span className='text-sm text-gray-500'>Don't have an account? </span>
                <Link href={'/signup'} className='text-blue-500 hover:text-blue-600'>Signup</Link>
            </div>
        </div>
    </div>
  )
}

export default page