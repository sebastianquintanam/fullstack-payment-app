import { WompiPaymentRequest } from '../store/types';

export interface WompiTransactionParams {
  amount: number;
  cardToken: string;
  reference: string;
}

export interface WompiResponse {
  id: string;
  reference: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  amount_in_cents: number;
  payment_method: {
    type: string;
    token: string;
    installments: number;
  };
}

export interface WompiPaymentResponse {
  id: string;
  status: string;
  amount: number;
  reference: string;
}

class WompiService {
  private readonly API_URL = 'https://api-sandbox.co.uat.wompi.dev/v1';
  private readonly PUBLIC_KEY = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';

  async createTransaction(params: WompiTransactionParams): Promise<WompiResponse> {
    try {
      const response = await fetch(`${this.API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount_in_cents: params.amount * 100,
          currency: 'COP',
          payment_method: {
            type: 'CARD',
            installments: 1,
            token: params.cardToken
          },
          reference: params.reference
        })
      });

      if (!response.ok) {
        throw new Error('Error en la transacción de Wompi');
      }

      const data = await response.json();
      return {
        id: data.id,
        reference: data.reference,
        status: data.status,
        amount_in_cents: data.amount_in_cents,
        payment_method: {
          type: data.payment_method.type,
          token: data.payment_method.token,
          installments: data.payment_method.installments
        }
      };
    } catch (error) {
      console.error('Error creating Wompi transaction:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Error desconocido al crear la transacción');
    }
  }

  async createPayment(paymentData: WompiPaymentRequest): Promise<WompiPaymentResponse> {
    try {
      const response = await fetch(`${this.API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.PUBLIC_KEY}`
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }

      const data = await response.json();
      return {
        id: data.data.id,
        status: data.data.status,
        amount: data.data.amount_in_cents / 100,
        reference: data.data.reference
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Error desconocido al crear el pago');
    }
  }

  async getTokenizedCard(cardData: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
  }): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}/tokens/cards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
      });

      if (!response.ok) {
        throw new Error('Error al tokenizar la tarjeta');
      }

      const data = await response.json();
      return data.data.id;
    } catch (error) {
      console.error('Error tokenizing card:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Error desconocido al tokenizar la tarjeta');
    }
  }
}

const wompiService = new WompiService();
export default wompiService;