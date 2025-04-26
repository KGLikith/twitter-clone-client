"use client";
import React from "react";
import { FormProvider } from "react-hook-form";
import { useSignInForm } from "@/hooks/auth/use-sign-in";
import Loader from "@/components/ui/loader";

type Props = {
  children: React.ReactNode;
};

const SignInFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = useSignInForm();
  return (
      <FormProvider {...methods}>
        <form onSubmit={onHandleSubmit} className="h-full w-full">
          <div className="flex flex-col justify-between gap-3 h-full w-full ">
            <Loader className="h-full w-full flex justify-center items-center" state={loading}>{children}</Loader>
          </div>
        </form>
      </FormProvider>
  );
};

export default SignInFormProvider;
