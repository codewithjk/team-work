import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Badge } from 'lucide-react'
import PaymentLink from '../PaymentLink'
import { Check } from 'lucide-react'
import { PopularPlanType, pricingList } from '../../../constants/pricelist'
import { XCircleIcon } from 'lucide-react'

function PricingPopover({closepopup}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          
          <div className="relative flex gap-8 bg-background p-3  rounded">
            <XCircleIcon onClick={()=>closepopup(false)} className='absolute top-0 end-0'/>        {pricingList.map((pricing,index) => (
            (index != 0) &&
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
        </div>
  )
}

export default PricingPopover