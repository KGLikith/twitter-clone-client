
import SignUpFormProvider from '@/components/forms/sign-up/form-provider'
import SignUpForm from '@/components/forms/sign-up/sign-up-form'
import React from 'react'

type Props = {}

export default function page({ }: Props) {
  return (
    <div className="flex-1 pt-12 px-6 md:px-16 w-full mt-2">
      <div className="flex flex-col h-full gap-3">
        <SignUpFormProvider>
          <div className="flex flex-col gap-3">
            <SignUpForm />
          </div>
        </SignUpFormProvider>
      </div>
    </div>
  )
}