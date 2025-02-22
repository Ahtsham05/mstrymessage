import { z } from "zod";

export const acceptMessageValidationSchema = z.object({
    acceptMessages : z.boolean()
})