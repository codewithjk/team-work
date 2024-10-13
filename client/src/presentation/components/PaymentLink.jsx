"use client";

import { Link } from "react-router-dom";
import { buttonVariants } from "./ui/button";

const PaymentLink = ({ href, paymentLink, text }) => {
  console.log(href, paymentLink, text);
  return (
    <Link
      to={href}
      className={buttonVariants()}
      onClick={() => {
        if (paymentLink) {
          localStorage.setItem("stripePaymentLink", paymentLink);
        }
      }}
    >
      {text}
    </Link>
  );
};

export default PaymentLink;
