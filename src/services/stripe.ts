import Stripe from 'stripe'
console.log(' process.env.STRIPE_API_KEY', process.env.STRIPE_API_KEY)


export const stripe = new Stripe(
    process.env.STRIPE_API_KEY,
    {
        apiVersion: '2022-11-15',
        appInfo: {
            name: 'Ignews',
            version: '0.1.0'
        }
    }
)