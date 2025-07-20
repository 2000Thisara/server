import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: null,
    });
  }

  async createCheckoutSession(lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/successPayment?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        shipping_address_collection: {
          allowed_countries: ['LK', 'US', 'CA'], // ✅ Add countries here
        },
      });
      return { id: session.id, url: session.url };
    } catch (error) {
      console.error('Stripe session error:', error);
      throw error;
    }
  }
}
