import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { OrderRepository } from '@models/index';

@Injectable()
export class PaymentService {
  private readonly apiKey = process.env.PAYMOB_API_KEY;
  private readonly integrationId = process.env.PAYMOB_INTEGRATION_ID;
  private readonly iframeId = process.env.PAYMOB_IFRAME_ID;
  private readonly hmacSecret = process.env.PAYMOB_HMAC_SECRET!;
  private readonly baseUrl = 'https://accept.paymob.com/api';

  constructor(private readonly orderRepository: OrderRepository) {
    if (!this.hmacSecret) {
      throw new Error('PAYMOB_HMAC_SECRET is not defined');
    }
  }

  private async getAuthToken(): Promise<string> {
    const response = await axios.post(`${this.baseUrl}/auth/tokens`, {
      api_key: this.apiKey,
    });
    return response.data.token;
  }

  private async createPaymentOrder(totalAmount: number, authToken: string): Promise<string> {
    const response = await axios.post(`${this.baseUrl}/ecommerce/orders`, {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: totalAmount * 100,
      currency: 'EGP',
      items: []
    })
    return response.data.id;
  }

  private async getPaymentKey(
    authToken: string,
    paymobOrderId: string,
    totalAmount: number,
    user: any,
  ): Promise<string> {
    const response = await axios.post(`${this.baseUrl}/acceptance/payment_keys`, {
      auth_token: authToken,
      amount_cents: totalAmount * 100,
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: {
        first_name: user.name ?? 'NA',
        last_name: 'NA',
        email: user.email ?? 'NA',
        phone_number: user.phoneNumber ?? 'NA',
        apartment: 'NA',
        floor: 'NA',
        street: 'NA',
        building: 'NA',
        shipping_method: 'NA',
        postal_code: 'NA',
        city: 'NA',
        country: 'NA',
        state: 'NA',
      },
      currency: 'EGP',
      integration_id: this.integrationId,
    });
    return response.data.token;
  }

  async create(totalAmount: number, user: any) {
    const authToken = await this.getAuthToken();

    const paymobOrderId = await this.createPaymentOrder(totalAmount, authToken);

    const paymentKey = await this.getPaymentKey(authToken, paymobOrderId, totalAmount, user);

    return {
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${this.iframeId}?payment_token=${paymentKey}`,
      paymobOrderId,
    };
  }

  async handleWebhook(body: any, hmac: string) {

    // 1. Verify HMAC
    const isValid = this.verifyHmac(body, hmac);
    if (!isValid) throw new Error('Invalid HMAC');


    if (body.type === 'TRANSACTION' && body.obj.success === true) {
      const paymobOrderId = body.obj.order.id.toString();

      await this.orderRepository.update(
        { paymentIntentId: paymobOrderId },
        {
          isPaid: true,
          paidAt: new Date(),
          status: 'processing',
        },
        { new: true },
      );
    }

    return { received: true };
  }

  // ===== Verify HMAC =====
  private verifyHmac(body: any, receivedHmac: string): boolean {
    const obj = body.obj;

    const hmacString = [
      obj.amount_cents,
      obj.created_at,
      obj.currency,
      obj.error_occured,
      obj.has_parent_transaction,
      obj.id,
      obj.integration_id,
      obj.is_3d_secure,
      obj.is_auth,
      obj.is_capture,
      obj.is_refunded,
      obj.is_standalone_payment,
      obj.is_voided,
      obj.order?.id,
      obj.owner,
      obj.pending,
      obj.source_data?.pan,
      obj.source_data?.sub_type,
      obj.source_data?.type,
      obj.success,
    ]
      .map((val) => String(val))
      .join('');

    const hash = crypto
      .createHmac('sha512', this.hmacSecret!)
      .update(hmacString)
      .digest('hex');
    return hash === receivedHmac;
  }

  // ===== Refund =====
  async refund(transactionId: string, totalAmount: number) {
    const authToken = await this.getAuthToken();

    await axios.post(`${this.baseUrl}/acceptance/void_refund/refund`, {
      auth_token: authToken,
      transaction_id: transactionId,
      amount_cents: totalAmount * 100,
    });

    return { refunded: true };
  }
}

