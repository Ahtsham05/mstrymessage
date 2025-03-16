"use client"
import { Switch } from "@/components/ui/switch"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, RefreshCw } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { toast } from '@/hooks/use-toast'
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageValidationSchema } from "@/schemas/acceptMessageSchema"
import MessageCard from "@/components/MessageCard"
import { IMessage } from "@/models/user.model"
const page = () => {
  const { data : session} = useSession()
  const [messages, setMessages] = React.useState<IMessage[]>([])
  const [switchLoading, setSwitchLoading] = React.useState(false)
  const [userUrl, setUserUrl] = React.useState('')
  const [acceptMessageStatus, setAcceptMessageStatus] = React.useState(false)
  const user : User = session?.user as User

  const form = useForm({
    resolver: zodResolver(acceptMessageValidationSchema),
    defaultValues: {
      acceptMessages: acceptMessageStatus,
    },
  })

  const { register } = form
  const handleAcceptMessage = useCallback(async ()=>{
    try {
      const response = await axios(`/api/accept-messages`,{
        method: 'GET',
      })
      const { data : responseData } = response
      if(responseData.success){
        setAcceptMessageStatus(responseData.data.isAcceptingMessages)
      }else{
        toast({
          title: "Error",
          description: responseData.message,
        })
      }
    } catch (error) {
      console.log("Accepting messages Failed!", error)
      toast({
        title: "Error",
        description: "Failed to accept messages",
      })
    }
  },[session])

  const getAllMessages = async ()=>{
    try {
      const response = await axios.get(`/api/get-messages`)
      const { data : responseData } = response
      if(responseData.success){
        setMessages(responseData.data)
      }else{
        toast({
          title: "Error",
          description: responseData.message,
        })
      }
    } catch (error) {
      console.log("Error fetching Messages", error)
      toast({
        title: "Error",
        description: "Failed to fetch messages",
      })
    }
  }

  const deleteMessage = async (messageId:string)=>{
    try {
      const response = await axios.post(`/api/delete-message`,{
        messageId
      })
      const { data : responseData } = response
      if(responseData.success){
        toast({
          title: "Success",
          description: "Message deleted successfully",
        })
        getAllMessages()
      }else{
        toast({
          title: "Error",
          description: responseData.message,
        })
      }
    } catch (error) {
      console.log("Deleting message Failed!", error)
      toast({
        title: "Error",
        description: "Failed to delete!",
      })
    }
  }

  useEffect(() => {
    handleAcceptMessage()
    getAllMessages()
    if(session){
      const pathname = `${window.location.origin}/u/${user?.username}`
      setUserUrl(pathname)
    }
  },[session,user])

  const handleMessageStatus = async({acceptMessages}:{acceptMessages:Boolean})=>{
    setSwitchLoading(true)
    try {
      const response = await axios.post(`/api/accept-messages`,{
        isAcceptingMessages:!acceptMessages
      })
      const { data : responseData } = response

      if(responseData.success){
        setAcceptMessageStatus(responseData.data.isAcceptingMessages)
        toast({
          title: "Success",
          description: responseData.message,
        })
      }else{
        toast({
          title: "Error",
          description: responseData.message,
        })
      }
    } catch (error) {
      console.log("Toggling message status Failed!", error)
      toast({
        title: "Error",
        description: "Failed to toggle message status",
      })
    } finally {
      setSwitchLoading(false)
    }
  }

  const copiedToClipboard = () => {
    navigator.clipboard.writeText(userUrl || '')
    toast({
      title: "Copied",
      description: "Mstry Message URL has been copied to your clipboard",
    })
  }

  if(!session || !session.user) {
    return (
      <div className='p-4 container mx-auto'>
        <h1 className='text-2xl font-bold text-neutral-700'>/User Dashboard</h1>
        <p>Please Sign In to Access this Page.</p>
      </div>
    )
  }
  return (
    <div className='p-4 container mx-auto'>
        <div className='grid gap-8'>
          <h1 className='text-2xl font-bold text-neutral-700'>/User Dashboard</h1>
          <div>
            <div className='grid gap-2'>
              <p>Mstry Message URL </p>
              <div className='flex max-w-lg gap-2'>
                <Input disabled value={userUrl}/>
                <Button onClick={copiedToClipboard}><Copy/></Button>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="acceptMessageStatus1" disabled={switchLoading} checked={acceptMessageStatus} onCheckedChange={()=>handleMessageStatus({acceptMessages : acceptMessageStatus})} {...register("acceptMessages")}/>
                <Label htmlFor="acceptMessageStatus1">Accept Messages</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center py-2">
            <h1 className="font-semibold text-neutral-700">All Messages</h1>
            <button className="p-2 shadow rounded cursor-pointer" onClick={getAllMessages}><RefreshCw /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {messages && messages.map((msg, index)=>(
              <div key={index} className=''>
                <MessageCard title={msg?._id} deleteMessage={deleteMessage} message={msg?.content} createdAt={new Date(msg?.createdAt).toDateString()} />
              </div>
            ))}
          </div>
        </div>
    </div>
  )
}

export default page