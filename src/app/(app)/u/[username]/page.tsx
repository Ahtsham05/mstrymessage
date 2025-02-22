"use client"
import React, { useCallback } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageValidationSchema } from '@/schemas/messageSchema'
import * as z from "zod"
import { toast } from '@/hooks/use-toast'
import axios from 'axios'


const page = () => {
  const params = useParams()
  const username = params.username

  type CreatemessageValidationSchema = z.infer<typeof messageValidationSchema>
  
  const form = useForm<CreatemessageValidationSchema>({
    resolver:zodResolver(messageValidationSchema),
    defaultValues: {
      message: "",
      createdAt: new Date(),
    },
  })


  const { register, handleSubmit , formState : {errors , isSubmitted} } = form

  const SendMessage = useCallback(async (data : CreatemessageValidationSchema)=>{
    try {
      const response = await axios.post(`/api/send-message`,{...data,username})
      const { data : responseData } = response
      if(responseData.success){
        toast({
          title: "Success",
          description: "Message sent successfully",
        })
        form.reset()
      }else {
        toast({
          title: "Error",
          description: responseData.message,
        })
      }
    } catch (error) {
      console.error("error sending message", error)
      toast({
        title: "Error",
        description: "Failed to send message",
      })
    }
  },[])

  const suggestNewMessages = useCallback(async()=>{
    try {
      const response = await axios.post(`/api/suggest-messages`)
      const { data : responseData } = response
      console.log("suggestNewMessages",responseData)
    } catch (error) {
      console.error("error suggesting new messages", error)
    }
  },[])

  return (
    <div className='p-4 container mx-auto'>
      <div className='my-10 flex flex-col justify-center items-center gap-10'>
        <h1 className='text-2xl lg:text-4xl text-neutral-800 font-semibold text-center'>
          Public Profile Link
        </h1>
        <div className='max-w-xl w-full grid gap-2'>
          <p className='font-semibold text-neutral-800'>Send Anonymous message to @{username}</p>
          <Textarea placeholder='Write Anonymous message here!' {...register("message")}/>
          {
            isSubmitted && errors.message && (
              <p className='text-red-500'>{errors.message.message}</p>
            )
          }
          <Button onClick={handleSubmit(SendMessage)}>Send message</Button>
        </div>
        {/* <div className='w-full max-w-xl grid gap-2'>
          <Button className='w-fit' onClick={suggestNewMessages}>Suggest New Messages</Button>
          <h1 className='font-semibold text-neutral-800'>Click on any message below to select it.</h1>
          <div className='border rounded p-2 lg:p-4 grid gap-2'>
            <h1 className='font-semibold text-xl text-neutral-800'>Messages</h1>
            <div className='border p-2 rounded'>Message 1</div>
            <div className='border p-2 rounded'>Message 1</div>
            <div className='border p-2 rounded'>Message 1</div>
            <div className='border p-2 rounded'>Message 1</div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default page