import { z } from "zod";

export const messageValidationSchema = z.object({
    message: z.string().min(20).max(200),
    createdAt: z.date(),
})