import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
})

export const signUpSchema = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(6).max(20),
    confirmPassword: z.string().min(6).max(20),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
})