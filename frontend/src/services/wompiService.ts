// src/services/wompiService.ts

const WOMPI_PUBLIC_KEY = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';
const WOMPI_API_URL = 'https://api-sandbox.co.uat.wompi.dev/v1';

interface WompiTransactionParams {
  amount: number;
  cardToken: string;
  reference: string;
}

interface WompiResponse {
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

export const wompiService = {
  async createTransaction(params: WompiTransactionParams): Promise<WompiResponse> {
    try {
      const response = await fetch(`${WOMPI_API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`,
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
  },

  async getTokenizedCard(cardData: {
    number: string;
    exp_month: string;
    exp_year: string;
    cvc: string;
  }): Promise<string> {
    try {
      const response = await fetch(`${WOMPI_API_URL}/tokens/cards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cardData)
      });

      if (!response.ok) {
        throw new Error('Error al tokenizar la tarjeta');
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error tokenizing card:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Error desconocido al tokenizar la tarjeta');
    }
  },

  async validateTransaction(transactionId: string): Promise<WompiResponse> {
    try {
      const response = await fetch(`${WOMPI_API_URL}/transactions/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al validar la transacción');
      }

      return await response.json();
    } catch (error) {
      console.error('Error validating transaction:', error);
      throw error instanceof Error 
        ? error 
        : new Error('Error desconocido al validar la transacción');
    }
  }
};

export type { WompiTransactionParams, WompiResponse };