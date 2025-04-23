"use client"
import { useEffect, useState } from "react"
import { Check, Router } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import SubscriptionInfo from "./subscription-info"
import { useRouter } from "next/navigation"

interface Plan {
    name: string
    price: number
    yearlyPrice?: number
    durationInMonths: number
}

export const plans: Plan[] = [
    { name: "Monthly", price: Number(process.env.NEXT_PUBLIC_MONTHLY_PRICE), durationInMonths: 1 },
    { name: "Yearly", price: Number(process.env.NEXT_PUBLIC_YEARLY_PRICE) / 12, yearlyPrice: Number(process.env.NEXT_PUBLIC_YEARLY_PRICE), durationInMonths: 12 },
]

const benefits = [
    "Create and manage multiple workspaces",
    "Store and organize unlimited videos",
    "Invite team members",
    "Collaborative annotation"
]

interface Props {
    subscription: any | null
    email: string;
    name: string
    plan?: string
    userId: string
}

export function SubscriptionCard({ userId, plan, subscription, email, name }: Props) {
    const [selectedPlan, setSelectedPlan] = useState(plans[1])
    const [showPayPalButtons, setShowPayPalButtons] = useState(false)
    const [showPlans, setShowPlans] = useState(false)
    const { theme } = useTheme()
    const lightmode = theme === "light"
    const router = useRouter();

    if (!userId) return null;

    const handlePay = () => {
        if (!userId) {
            toast.error("Please log in to proceed.")
            return
        }
        if (subscription?.plan !== "NONE") {
            toast.info("You are already subscribed.")
            return
        }
        setShowPayPalButtons(true)
    }

    // const savePayment = async (paymentId: string) => {
    //     try {
    //         const { error } = await savePaymentToDb(userId, paymentId)

    //         if (error) {
    //             console.log(error)
    //             toast.error("An error occurred while saving the payment.")
    //             return { error }
    //         }
    //     } catch (error) {
    //         console.error(error)
    //         toast.error("An error occurred while saving the payment.")
    //         return { error }
    //     }
    // }

    // const saveOrderToDatabase = async (subscriptionData: {
    //     transaction: {
    //         orderId: string
    //         amount: number
    //     }
    //     expiryDate: Date
    //     startDate: Date
    //     plan: "MONTHLY" | "YEARLY"
    // }) => {
    //     try {
    //         const { error } = await saveOrder(userId, subscriptionData)

    //         if (error) {
    //             console.log(error)
    //             toast.error("An error occurred while saving the subscription.")
    //             return { error }
    //         }
    //     } catch (error) {
    //         console.error(error)
    //         toast.error("An error occurred while saving the subscription.")
    //         return { error }
    //     }
    // }

    if (plan) {
        const selectedPlan = plans.find((p) => p.name === plan)
        if (selectedPlan) {
            setSelectedPlan(selectedPlan)
            handlePay();
        }
    }

    const renderPlansCard = () => (
        <Card
            className={cn(
                "w-full max-w-sm",
                lightmode ? "bg-zinc-50 text-black border-gray-300" : "bg-card border border-border",
            )}
        >
            <CardHeader className="space-y-1 p-6">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className={cn("h-3 w-3", lightmode ? "text-gray-800" : "text-primary")} />
                        </div>
                        <div className={cn("text-sm", lightmode ? "text-gray-600" : "text-muted-foreground")}>
                            {selectedPlan.name} billing
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={cn("text-sm", lightmode ? "text-gray-600" : "text-muted-foreground")}>Monthly</span>
                        <Switch
                            checked={selectedPlan.name === "Yearly"}
                            onCheckedChange={() => {
                                const nextPlan = selectedPlan.name === "Yearly" ? plans[0] : plans[1]
                                setSelectedPlan(nextPlan)
                            }}
                            className={cn(lightmode ? "bg-gray-300 data-[state=checked]:bg-gray-800" : "")}
                        />
                        <span className={cn("text-sm", lightmode ? "text-gray-600" : "text-muted-foreground")}>Yearly</span>
                    </div>
                </div>
                <div className="flex items-baseline">
                    <span className={cn("text-3xl font-bold", lightmode ? "text-gray-800" : "")}>$</span>
                    <span className={cn("text-4xl font-bold", lightmode ? "text-gray-800" : "")}>
                        {selectedPlan.price!.toFixed(2)}
                    </span>
                    <span className={cn("ml-1", lightmode ? "text-gray-600" : "text-muted-foreground")}>/mo</span>
                </div>
                {selectedPlan.name === "Yearly" && (
                    <div className={cn("text-sm", lightmode ? "text-gray-600" : "text-muted-foreground")}>
                        ${selectedPlan.yearlyPrice!.toFixed(2)} per year
                        <span className="text-emerald-500 ml-2">
                            save {(((plans[0].price * 12 - selectedPlan.yearlyPrice!) / (plans[0].price * 12)) * 100).toFixed(2)}%
                        </span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <ul className="space-y-3">
                    {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2">
                            <div className={cn("h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center", lightmode ? "bg-zinc-300" : "")}>
                                <Check className={cn("h-3 w-3", lightmode ? "text-gray-800 " : "text-primary")} />
                            </div>
                            <span className="text-sm">{benefit}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex w-full justify-center items-center">
                {subscription?.plan !== "NONE" ? (
                    <Button
                        className={cn(
                            "w-full",
                            lightmode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-200",
                        )}
                        disabled
                    >
                        Already Subscribed
                    </Button>
                ) : showPayPalButtons ? (
                    <div className="w-full">
                        {/* <PayPalButtons
                            style={{ layout: "horizontal", height: 40, color: lightmode ? "black" : "white", label: "pay", tagline: false }}
                            createOrder={async () => {
                                try {
                                    const response = await createOrder({
                                        email: email,
                                        name: name,
                                        price: selectedPlan.name === "Yearly" ? selectedPlan.yearlyPrice! : selectedPlan.price!,
                                        description: `Subscription to ${selectedPlan.name} Plan`,
                                    })

                                    if (response.jsonResponse.id) {
                                        return response.jsonResponse.id
                                    } else {
                                        throw new Error("Order creation failed.")
                                    }
                                } catch (error) {
                                    console.error(error)
                                    toast.error("Failed to create the order.")
                                    return Promise.reject()
                                }
                            }}
                            onApprove={async (data) => {
                                try {
                                    const orderData = {
                                        transaction: {
                                            orderId: data.orderID,
                                            amount: selectedPlan.name === "Yearly" ? selectedPlan.yearlyPrice! : selectedPlan.price!,
                                        },
                                        plan: selectedPlan.name.toUpperCase() as "MONTHLY" | "YEARLY",
                                        startDate: new Date(),
                                        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + selectedPlan.durationInMonths)),
                                    }
                                    orderData.expiryDate.setDate(orderData.expiryDate.getDate() + 1);
                                    orderData.expiryDate.setHours(0, 0, 0, 0);
                                    const resp = await saveOrderToDatabase(orderData)

                                    if (resp?.error) {
                                        return
                                    }

                                    const response = await captureOrder(data.orderID)
                                    if (response.httpStatusCode === 404) {
                                        toast.error("Failed to capture the order.")
                                        return
                                    }

                                    const ress = await savePayment(response.jsonResponse.purchase_units[0].payments.captures[0].id)

                                    if (ress?.error) {
                                        return
                                    }
                                    router.refresh();
                                    toast.success("Payment successful and subscription activated!", {
                                        duration: 3000,
                                        description: "Please refresh your page, if the changes are not visible."
                                    })

                                } catch (error) {
                                    console.error(error)
                                    toast.error("Failed to capture the order.")
                                }
                            }}
                            onError={(err) => {
                                console.log(err)
                                toast.error("An error occurred with the payment process.")
                            }}
                        /> */}
                    </div>
                ) : (
                    <Button
                        className={cn(
                            "w-full",
                            lightmode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-200",
                        )}
                        onClick={handlePay}
                    >
                        {selectedPlan.name === "Yearly" ? "Purchase Yearly" : "Purchase Monthly"}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )

    return (
        // <PayPalScriptProvider
        //     options={{
        //         clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
        //         vault: true,
        //     }}
        // >
        //     <div className="flex flex-col gap-5 w-full ">
        //         {subscription?.plan !== "NONE" ? (
        //             <>
        //                 <SubscriptionInfo subscription={subscription} />
        //                 <div className="flex flex-col gap-3 w-full ">
        //                     <div className="flex items-center gap-2">
        //                         <span className="text-sm font-medium">Show Plans</span>
        //                         <Switch checked={showPlans} onCheckedChange={setShowPlans} />
        //                     </div>
        //                     <div className={cn("transition-all duration-300", showPlans ? "block" : "hidden")}>
        //                         {renderPlansCard()}
        //                     </div>
        //                 </div>
        //             </>
        //         ) : (
        //             <div className="w-full flex justify-center">{renderPlansCard()}</div>
        //         )}
        //     </div>
        // </PayPalScriptProvider>
        <></>
    )
}

