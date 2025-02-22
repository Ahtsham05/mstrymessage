"use client"
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from '@/components/ui/button'
import { useForm } from "react-hook-form";
import {Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import * as z from "zod"
import { verifyValidationSchema } from "@/schemas/verifySchema"
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import { toast } from '@/hooks/use-toast'

const page = () => {
  const router = useRouter()
  const params = useParams()
  const username = params?.username
  const form = useForm<z.infer<typeof verifyValidationSchema>>({
    resolver: zodResolver(verifyValidationSchema),
    defaultValues: {
      code: '',
    }
  })

  const submitHandler = async(data : z.infer<typeof verifyValidationSchema>) => {
    try {
      const payload = {
        username,
        code: data.code,
      }

      const response = await axios.post(`/api/auth/verify-user`, payload)
      const { data : responseData } = response

      if(responseData.success){
        toast({
          title: "Success",
          description: responseData?.message,
        })
        router.push(`/signin`)
      }else{
        toast({
          title: "Error",
          description: responseData?.message,
        })
      }

    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>
      toast({
        title: "Error",
        description: axiosError?.response?.data?.message || "Something went wrong",
      })
    }
  }

  return (
    <div className='bg-gray-100 h-screen w-full flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white p-8 flex flex-col gap-4 items-center justify-center shadow-md rounded'>
        <h1 className='text-2xl capitalize font-bold text-center text-neutral-800'>Enter OTP</h1>
        <div>
          <Form {...form}>
            <form action="" onSubmit={form.handleSubmit(submitHandler)} className='grid gap-4'>
              <FormField
              name='code'
              control={form.control}
              render={({field})=>(
                <FormItem>
                    <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FormMessage />
                </FormItem>
              )}
              />
              <Button type='submit' className='mt-4'>verify otp</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default page