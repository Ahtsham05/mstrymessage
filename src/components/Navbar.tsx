"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { User} from 'next-auth'
import Link from 'next/link'

const Navbar = () => {
  const {data : userData} = useSession()
  
  return (
    <nav className='shadow-md'>
      <div className='container mx-auto h-[60px] px-4 flex justify-between items-center'>
            <Link href={"/"} className='text-lg font-semibold'>Mstry Message</Link>
            <div>
              {
                userData ? (
                  <Button onClick={()=> signOut()}>Logout</Button>
                ):(
                  <Link href={"/signin"}>
                    <Button>Signin</Button>
                  </Link>
                )
              }
          </div>
      </div>
    </nav>
  )
}

export default Navbar