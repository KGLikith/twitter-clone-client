'use client'
import PricingPlans from '@/components/app_components/Subsription/pricingplans'
import SubscriptionDetailsCard from '@/components/app_components/Subsription/subscription-details';
import Loader from '@/components/ui/loader';
import { Plan, Subscription } from '@/gql/graphql';
import { useGetSubscription } from '@/hooks/user'
import React from 'react'

type Props = {}

export default function ({ }: Props) {
  const { subscription, isLoading } = useGetSubscription()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader state></Loader>
      </div>
    )
  }
  
  return (
    <>
      {
        (subscription?.plan!=="FREE" && subscription?.active)?
          <>
            <div className="p-6 bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col items-center justify-center">
              <SubscriptionDetailsCard subscription={subscription as Subscription} />
            </div>
          </>
          :
          <>
            <PricingPlans subscription={subscription as Subscription} />
          </>
      }
    </>
  )
}