"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { UserSignUpProps, UserSignUpSchema } from "@/schema/auth";
import { createUserMutation } from "@/graphql/mutation/user";
import { apolloClient } from "@/clients/api";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

export const useSignUpForm = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const methods = useForm<z.infer<typeof UserSignUpSchema>>({
        resolver: zodResolver(UserSignUpSchema),
        mode: "onChange",
    });
    const queryclient = useQueryClient();

    const onHandleSubmit = methods.handleSubmit(
        async (values: UserSignUpProps) => {
            try {
                setLoading(true)
                const { email, password, fullname } = await UserSignUpSchema.parseAsync(values)
                const { data: res } = await apolloClient.mutate({
                    mutation: createUserMutation,
                    variables: {
                        email,
                        password,
                        name: fullname,
                    },
                })
                if (res?.createUser?.success) {
                    const res = await signIn("credentials", {
                        redirect: false,
                        email,
                        password,
                    });
                    if (!res?.ok) {
                        toast.info("Account Created Successfully.Please sign in", {
                            duration: 2000,
                            description: "Could not sign in",
                        });
                        return
                    }
                    const sessionRes = await fetch("/api/auth/session");
                    const session = await sessionRes.json();

                    const token = session.backendToken;

                    if (token) {
                        window.localStorage.setItem("__twitter_token", token);
                        await apolloClient.resetStore();
                        await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
                        router.push('/')
                        toast.success('Account created successfully', {
                            duration: 2000,
                        });
                    } else {
                        toast.info("Please sign in")
                        router.push('/auth/sign-in')
                    }
                } else {
                    console.log(res?.createUser?.message)
                    toast.error(res?.createUser?.message || "Something went wrong. Please try again later.", {
                        duration: 2000,
                        description: res?.createUser?.message || "Could not create account",
                    });
                }
            } catch (err) {
                console.log(err)
                toast.error("Something went wrong. Please try again later.", {
                    duration: 2000,
                    description: err instanceof Error ? err.message : String(err),
                });
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
    );
    return {
        methods,
        onHandleSubmit,
        loading,
    };
};
