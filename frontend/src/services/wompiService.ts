import type { WompiPaymentRequest } from '../store/types';

interface WompiErrorResponse {
  error: {
    type: string;
    reason: string;
    message: string;
  };
}

interface WompiPaymentResponse {
  data: {
    id: string;
    created_at: string;
    amount_in_cents: number;
    reference: string;
    currency: string;
    payment_method_type: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
    payment_method: {
      type: string;
      extra: {
        brand: string;
        last_four: string;
        installments: number;
      };
    };
  };
}

class WompiService {
  private readonly API_URL = 'https://api-sandbox.co.uat.wompi.dev/v1';
  private readonly PUBLIC_KEY = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json() as WompiErrorResponse;
      throw new Error(errorData.error.message || 'Payment request failed');
    }
    return response.json() as Promise<T>;
  }

  async createPayment(paymentData: WompiPaymentRequest): Promise<WompiPaymentResponse> {
    try {
      const response = await fetch(`${this.API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.PUBLIC_KEY}`
        },
        body: JSON.stringify({
          amount_in_cents: paymentData.amount * 100, // Wompi espera el monto en centavos
          currency: paymentData.currency,
          payment_method: paymentData.payment_method,
          reference: paymentData.reference,
        })
      });

      return this.handleResponse<WompiPaymentResponse>(response);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Payment creation failed');
    }
  }

  async getPaymentStatus(transactionId: string): Promise<WompiPaymentResponse> {
    try {
      const response = await fetch(`${this.API_URL}/transactions/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.PUBLIC_KEY}`
        }
      });

      return this.handleResponse<WompiPaymentResponse>(response);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get payment status');
    }
  }

  async tokenizeCard(cardData: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}/tokens/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.PUBLIC_KEY}`
        },
        body: JSON.stringify(cardData)
      });

      const data = await this.handleResponse<{ data: { id: string } }>(response);
      return data.data.id;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Card tokenization failed');
    }
  }
}

const wompiService = new WompiService();
export default wompiService;