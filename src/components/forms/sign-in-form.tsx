"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { signInSchema } from "@/schema/auth"
import { signInUser } from "@/actions/auth"

export default function SignInForm() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        try {
            setLoading(true)
            const { email, password } = await signInSchema.parseAsync(data)
            const res = await signInUser(email, password)

            if (res.success) {
                toast.success("Signed in successfully")
                router.replace("/dashboard")
            } else {
                toast.error(res?.message || "Invalid credentials")
            }
        } catch (err) {
            toast.error("Something went wrong. Please try again.")
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background to-background/80 p-4 dotPattern">
            <Card className="w-full max-w-md rounded-2xl border border-border/40 bg-card/80 shadow-xl backdrop-blur-md p-6 md:p-8">
                <CardHeader className="flex flex-col items-center gap-4 p-0">
                    {/* <XorvaneLogo /> */}
                    <CardTitle className="text-3xl font-semibold text-foreground">Sign In</CardTitle>
                    <p className="text-sm text-muted-foreground">Enter your email and password</p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:ring-2 focus:ring-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm text-foreground">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                type="password"
                                                className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:ring-2 focus:ring-primary"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full transform rounded-lg bg-primary p-3 text-lg font-semibold text-primary-foreground transition duration-300 ease-in-out hover:scale-105 hover:bg-primary/90"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <Button
                            type="button"
                            onClick={() => router.replace("/auth/sign-up")}
                            className="text-sm text-primary hover:text-primary/80"
                            variant="link"
                        >
                            Don't have an account? Sign up
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
