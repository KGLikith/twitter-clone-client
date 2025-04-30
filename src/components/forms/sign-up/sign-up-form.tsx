"use client"
import { useFormContext } from "react-hook-form"
import { USER_SIGNUP_FORM } from "@/constants/forms"
import FormGenerator from "../form-generator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { apolloClient } from "@/clients/api"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { handleGoogleSignIn } from "@/actions/auth"

function SignUpForm() {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext()
    const queryclient = useQueryClient()


    return (
        <>
            <h2 className="text-gray-400 md:text-4xl font-bold">Account details</h2>
            <p className="text-gray-500 md:text-sm">Enter your name, email and password</p>
            {USER_SIGNUP_FORM.map((field) => (
                <FormGenerator key={field.id} watch={watch} {...field} errors={errors} register={register} name={field.name} />
            ))}
            <div className="w-full flex flex-col gap-3 items-center ">
                <Button type="submit" className="w-full bg-white text-black hover:bg-gray-300">
                    Create an account
                </Button>

                <div className="relative w-full flex items-center justify-center my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleGoogleSignIn(queryclient)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:text-gray-900 text-black hover:bg-gray-100"
                >
                    <FcGoogle className="h-5 w-5" />
                    Sign up with Google
                </Button>

                <p className="text-gray-500 ">
                    Already have an account?
                    <Link href="/auth/sign-in" className="font-bold text-gray-400 hover:text-gray-300 px-1">
                        Sign In
                    </Link>
                </p>
            </div>
        </>
    )
}

export default SignUpForm
