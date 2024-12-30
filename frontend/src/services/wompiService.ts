// frontend/src/services/wompiService.ts

/**
 * Interfaces para las respuestas de la API de Wompi
 */
interface WompiErrorResponse {
    error: {
      type: string;
      reason: string;
      message: string;
    };
  }
  
  /**
   * Respuesta de la API de Wompi para transacciones
   * @see https://docs.wompi.co/docs/colombia/inicio-rapido
   */
  interface WompiPaymentResponse {
    data: {
      id: string;                   // ID único de la transacción
      reference: string;            // Referencia única del comercio
      status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';  // Estado de la transacción
      amount_in_cents: number;      // Monto en centavos
    };
  }
  
  /**
   * Datos necesarios para crear una transacción de pago en Wompi
   */
  interface WompiPaymentRequest {
    amount: number;
    currency: string;
    payment_method: {
      type: string;
      token: string;
    };
    reference: string;
  }

  /**
   * Servicio para interactuar con la API de Wompi
   * Maneja la creación de pagos, tokenización de tarjetas y consulta de estados
   */
  class WompiService {
    // URLs y llaves de la API en modo sandbox
    private readonly API_URL = 'https://api-sandbox.co.uat.wompi.dev/v1';
    private readonly PUBLIC_KEY = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';
  
    /**
     * Maneja las respuestas de la API y transforma los errores
     * @param response Respuesta de fetch
     * @returns Datos procesados de la respuesta
     * @throws Error si la respuesta no es exitosa
     */
    private async handleResponse<T>(response: Response): Promise<T> {
      if (!response.ok) {
        const errorData = await response.json() as WompiErrorResponse;
        throw new Error(errorData.error.message || 'Payment request failed');
      }
      return response.json() as Promise<T>;
    }
  
    /**
     * Crea una nueva transacción de pago
     * @param paymentData Datos del pago a realizar
     * @returns Respuesta de la transacción creada
     */
    async createPayment(paymentData: WompiPaymentRequest): Promise<WompiPaymentResponse> {
      try {
        const response = await fetch(`${this.API_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.PUBLIC_KEY}`
          },
          body: JSON.stringify({
            amount_in_cents: paymentData.amount * 100,
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
  
    /**
     * Consulta el estado de una transacción
     * @param transactionId ID de la transacción a consultar
     * @returns Estado actual de la transacción
     */
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
  
    /**
     * Tokeniza una tarjeta de crédito
     * @param cardData Datos de la tarjeta a tokenizar
     * @returns Token de la tarjeta
     */
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
  
  // Exportamos una única instancia del servicio
  const wompiService = new WompiService();
  export default wompiService;