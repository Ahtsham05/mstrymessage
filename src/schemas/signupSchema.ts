import { z } from "zod";

export const usernameValidationSchema = z.string({
        required_error: "Username is required",
    })
    .nonempty("Username cannot be empty")
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^\w+$/, "Username can only contain alphanumeric characters and underscores");

export const signupValidationSchema = z.object({
    username: usernameValidationSchema,
    email: z.string({
            required_error: "Email is required",
        })
        .nonempty("email cannot be empty")
        .email("Please enter a valid email address")
        .regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"),
        
    password: z.string({
            required_error: "Password is required",
        })
        .nonempty("password cannot be empty")
        .min(8, "Password must be at least 8 characters long")
        .max(50, "Password must be at most 50 characters long")
        .regex(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,50}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
})