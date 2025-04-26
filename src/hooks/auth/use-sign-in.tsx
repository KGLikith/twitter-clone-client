import { apolloClient } from "@/clients/api";
import { UserLoginProps, UserLoginSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserLoginErrorsQuery } from "../../graphql/query/user";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

export const useSignInForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const methods = useForm<z.infer<typeof UserLoginSchema>>({
        resolver: zodResolver(UserLoginSchema),
        mode: "onChange",
    })
    const queryclient = useQueryClient()

    const onHandleSubmit = methods.handleSubmit(async (values: UserLoginProps) => {
        try {
            console.log("values", values)
            setLoading(true);
            const { email, password } = await UserLoginSchema.parseAsync(values);
            const { data: { checkLoginCredentials } } = await apolloClient.query({
                query: UserLoginErrorsQuery,
                variables: {
                    email,
                    password,
                },
            });

            if (!checkLoginCredentials?.success) {
                toast.error(checkLoginCredentials?.message || "Invalid credentials")
                return
            }

            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (!res?.ok) {
                toast.info("Please sign in again", {
                    duration: 2000,
                    description: "Could not sign in",
                });
                return
            }
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();
            const token = session.backendToken;
            window.localStorage.setItem("__twitter_token", token);
            await apolloClient.resetStore();
            await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
            router.push("/")
            toast.success("Signed in successfully", {
                duration: 2000,
            });
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    })

    return {
        methods,
        onHandleSubmit,
        loading,
    }
}