import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Trash } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"


const MessageCard = ({title,message,createdAt,deleteMessage} : {
    title: string | any,
    message: string | any,
    createdAt: Date | any,
    deleteMessage?: any,
})=>{
    return (
        <Card>
            <CardHeader>
                <CardTitle>FeedBack</CardTitle>
                <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
                <p className="text-sm">{createdAt.toString()}</p>
                <AlertDialog>
                <AlertDialogTrigger className="p-2 shadow bg-red-400 text-neutral-100 rounded"><Trash size={20}/></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-400" onClick={()=>deleteMessage(title)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    )
}

export default MessageCard