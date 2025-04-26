'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { USER_LOGIN_FORM } from '@/constants/forms'
import FormGenerator from '../form-generator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { apolloClient } from '@/clients/api'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function SignInDetailForm() {
    const {
        register,
        formState: { errors },
    } = useFormContext()
    const queryclient = useQueryClient()

    const handleGoogleSignIn = async () => {
        try {
            //WIP: Not properly implemented yet
            await signIn("google", { callbackUrl: "/" })
            await apolloClient.resetStore();
            await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
        } catch (err) {
            toast.error("Google Sign In Failed", {
                duration: 2000,
            });
            console.log("Google Sign In Error", err)
        }
    }

    return (
        <>
            <h2 className="text-gray-400 md:text-4xl font-bold">Account details</h2>
            <p className="text-gray-500 md:text-sm">Enter your email and password</p>
            {USER_LOGIN_FORM.map((field) => (
                <FormGenerator
                    key={field.id}
                    {...field}
                    errors={errors}
                    register={register}
                    name={field.name}
                />
            ))}
            <div className="w-full flex flex-col gap-3 items-center ">
                <Button
                    className="w-full bg-white text-black hover:bg-gray-300"
                    type='submit'
                >
                    Submit
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
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:text-gray-900 hover:bg-gray-300"
                >
                    <FcGoogle className="h-5 w-5" />
                    Sign in with Google
                </Button>
                <p className="text-gray-500">
                    Don&apos;t have an account?
                    <Link href="/auth/sign-up" className="font-bold text-gray-400">
                        Sign Up
                    </Link>
                </p>
            </div>
        </>
    )
}

export default SignInDetailForm
