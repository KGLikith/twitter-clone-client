
import SignInFormProvider from '@/components/forms/sign-in/form-provider'
import SignInDetailForm from '@/components/forms/sign-in/sign-in-form'
import React from 'react'

type Props = {}

export default function page({ }: Props) {
  return (
    <div className="flex-1 pt-24 px-6 md:px-16 w-full mt-24 ">
      <div className="flex flex-col h-full  w-full gap-3">
        <SignInFormProvider>
          <div className="flex flex-col gap-3">
            <SignInDetailForm />
          </div>
        </SignInFormProvider>
      </div>
    </div>
  )
}