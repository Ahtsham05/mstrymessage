import { resend } from '@/lib/resend';
import { ReactNode } from 'react';

export interface IsendMail {
    from?: string;
    email: string;
    subject: string;
    react: ReactNode;
}

export const sendMail = async ({from='MstryMessages <onboarding@resend.dev>',email,subject,react}:IsendMail)=>{
    try {
        const response = await resend.emails.send({
            from,
            to:[email],
            subject,
            react,
        })
        return response
    } catch (error) {
        console.error(error);
        return error
    }
}