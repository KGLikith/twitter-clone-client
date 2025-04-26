"use client";
import React from "react";
import { FormProvider } from "react-hook-form";
import Loader from "@/components/ui/loader";
import { useSignUpForm } from "@/hooks/auth/use-sign-up";

type Props = {
  children: React.ReactNode;
};

const SignUpFormProvider = ({ children }: Props) => {
  const { methods, onHandleSubmit, loading } = useSignUpForm();
  return (
    <FormProvider {...methods}>
      <form onSubmit={onHandleSubmit} className="h-full">
        <div className="flex flex-col justify-between gap-3 h-full">
          <Loader className="h-full w-full flex justify-center items-center " state={loading}>
            {children}
          </Loader>
        </div>
      </form>
    </FormProvider>
  );
};

export default SignUpFormProvider;
