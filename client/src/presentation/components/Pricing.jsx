import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

import PaymentLink from "./PaymentLink";
const monthlyPlanLink = import.meta.env.VITE_STRIPE_MONTHLY_PLAN_LINK;
const yearlyPlanLink = import.meta.env.VITE_STRIPE_YEARLY_PLAN_LINK;

const PopularPlanType = {
  NO: 0,
  YES: 1,
};

const pricingList = [
  {
    title: "Free",
    popular: PopularPlanType.NO,
    price: 0,
    description: "project management for small teams",
    buttonText: "Get Started",
    benefitList: ["1 Team member", "2 GB Storage", "Community support"],
    href: "/signup",
    billing: "/month",
  },
  {
    title: "Premium",
    popular: PopularPlanType.YES,
    price: 10,
    description:
      "Monthly plan for larger teams, and greater workflow controls.",
    buttonText: "Buy Now",
    benefitList: ["4 Team member", "4 GB Storage", "Priority support"],
    href: "/signup",
    paymentLink: monthlyPlanLink,
    billing: "/month",
  },
  {
    title: "Enterprise",
    popular: PopularPlanType.NO,
    price: 99,
    description: "Yearly plan for large teams, and greater workflow controls.",
    buttonText: "Buy Now",
    benefitList: ["10 Team member", "8 GB Storage", "Priority support"],
    href: "/signup",
    paymentLink: yearlyPlanLink,
    billing: "/year",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Get{" "}
        <span className="bg-gradient-to-b from-[#667EEA] to-[#764BA2] uppercase text-transparent bg-clip-text">
          Unlimited{" "}
        </span>
        Access
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Our plans are packaged for value and priced for you so switching to
        Team-Work is a no-brainer, no matter where you are in your project
        management journey.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge variant="secondary" className="text-sm text-primary">
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">${pricing.price}</span>
                <span className="text-muted-foreground">
                  {" "}
                  {pricing.billing}
                </span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <PaymentLink
                href={pricing.href}
                text={pricing.buttonText}
                paymentLink={pricing.paymentLink}
              />
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit) => (
                  <span key={benefit} className="flex">
                    <Check className="text-purple-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
