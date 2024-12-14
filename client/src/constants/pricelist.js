const monthlyPlanLink = import.meta.env.VITE_STRIPE_MONTHLY_PLAN_LINK;
const yearlyPlanLink = import.meta.env.VITE_STRIPE_YEARLY_PLAN_LINK;


export const PopularPlanType = {
    NO: 0,
    YES: 1,
  };

export const pricingList = [
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
      benefitList: ["Create Projects","Assign task","Meetings"],
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
      benefitList: ["Create Projects","Assign task","Meetings"],
      href: "/signup",
      paymentLink: yearlyPlanLink,
      billing: "/year",
    },
  ];

