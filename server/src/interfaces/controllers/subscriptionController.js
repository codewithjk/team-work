const Stripe = require("stripe");
require("dotenv").config();
const {
  CreateSubscription,
  ListAllSubscription,
  GetSubscription,
  UpdateSubscription,
  DeleteSubscription,
} = require("../../application/use-cases/subscription-use-cases");
const SubscriptionRepositoryImpl = require("../../infrastructure/database/repositories/subscriptionRepositoryImpl");
const {
  GetUser,
  UpdateUser,
} = require("../../application/use-cases/user-use-cases");
const userRepositoryImpl = require("../../infrastructure/database/repositories/userRepositoryImpl");
const { sendInvoiceEmail } = require("../../shared/mailtrap/emails");


const subscriptionRepository = new SubscriptionRepositoryImpl();
const creatSubscriptionUseCase = new CreateSubscription(subscriptionRepository);
const listAllSubscriptionUseCase = new ListAllSubscription(
  subscriptionRepository
);
const getSubscriptionUsecase = new GetSubscription(subscriptionRepository);
const updateSubscriptionUsecase = new UpdateSubscription(
  subscriptionRepository
);
const deleteSubscriptionUsecase = new DeleteSubscription(
  subscriptionRepository
);


//user usecases
const getUserUseCase = new GetUser(userRepositoryImpl);
const updateUserUseCase = new UpdateUser(userRepositoryImpl);


const stripe = Stripe(process.env.STRIPE_SECRETE_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;


class SubscriptionController {
  async handleEvents(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
    } catch (err) {
      console.error(" Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          // Expand session to retrieve line items
          const retrievedSession = await stripe.checkout.sessions.retrieve(
            session.id,
            { expand: ["line_items"] }
          );
          const customerId = retrievedSession.customer;
          const customerDetails = retrievedSession.customer_details;


          if (customerDetails?.email) {
            // let user = await User.findOne({ email: customerDetails.email });
            let user = await getUserUseCase.execute({
              email: customerDetails.email,
            });
            if (!user) {
              throw new Error("User not found");
            }


            // Save customerId if not already saved
            if (!user.customerId) {
              user.customerId = customerId;
              // await user.save();
              await updateUserUseCase.execute(user._id, {
                customerId: customerId,
              });
            }
            const lineItems = retrievedSession.line_items?.data || [];
            console.log(lineItems);

            for (const item of lineItems) {
              const priceId = item.price.id;
              const isSubscription = item.price.type === "recurring";
              if (isSubscription) {
                let endDate = new Date();
                if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
                  endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now
                } else if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
                  endDate.setMonth(endDate.getMonth() + 1); // 1 month from now
                } else {
                  throw new Error("Invalid priceId");
                }
                await updateSubscriptionUsecase.execute(
                  { userId: user._id },
                  {
                    userId: user._id,
                    startDate: new Date(),
                    endDate: endDate,
                    plan: "premium",
                    period:
                      priceId === process.env.STRIPE_YEARLY_PRICE_ID
                        ? "yearly"
                        : "monthly",
                  },
                  { upsert: true }
                );
                await updateUserUseCase.execute(user._id, { plan: "premium" });
              }
            }
          }
          break;
        }
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          const customerId = subscription.customer;


          // const user = await User.findOne({ customerId });
          const user = await getUserUseCase.execute({ customerId: customerId });
          if (user) {

            await updateUserUseCase.execute(user._id, { plan: "free" });
          }
          break;
        }
        case "invoice.payment_succeeded": {
          try {
            const subscription = event.data.object;
            const email = subscription.customer_email;
            const customerName = subscription.customer_name;
            const url = subscription.hosted_invoice_url;
            await sendInvoiceEmail(email, url, customerName)
          } catch (error) {
            console.error(error)
          }
        }
        default:
      }
      res.status(200).send("Webhook handled successfully");
    } catch (error) {
      console.error("Error handling event:", error);
      res.status(400).send("Webhook handler error");
    }
  }
}


module.exports = SubscriptionController;



