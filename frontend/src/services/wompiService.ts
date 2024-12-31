// src/services/wompiService.ts

import type {
    Transaction,
    WompiPaymentRequest,
    CardTokenizationRequest,
  } from '../types';
  
  interface WompiErrorResponse {
    error: {
      type: string;
      reason: string;
      message: string;
    };
  }
  
  interface WompiPaymentResponse {
    id: string;
    reference: string;
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
    amount_in_cents: number;
  }
  
  class WompiService {
    private readonly API_URL = 'https://api-sandbox.co.uat.wompi.dev/v1';
    private readonly PUBLIC_KEY = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';
  
    private mapWompiStatus(wompiStatus: string): 'PENDING' | 'COMPLETED' | 'FAILED' {
      const statusMap = {
        APPROVED: 'COMPLETED',
        PENDING: 'PENDING',
        DECLINED: 'FAILED',
        ERROR: 'FAILED',
      } as const;
  
      return statusMap[wompiStatus as keyof typeof statusMap];
    }
  
    private async handleResponse<T>(response: Response): Promise<T> {
      if (!response.ok) {
        const errorData = (await response.json()) as WompiErrorResponse;
        throw new Error(errorData.error.message || 'Request failed');
      }
      return response.json() as Promise<T>;
    }
  
    async createPayment(paymentRequest: WompiPaymentRequest): Promise<Transaction> {
      try {
        const response = await fetch(`${this.API_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.PUBLIC_KEY}`,
          },
          body: JSON.stringify({
            amount_in_cents: paymentRequest.amount * 100, // Convert amount to cents
            currency: paymentRequest.currency,
            payment_method: paymentRequest.payment_method,
            reference: paymentRequest.reference,
          }),
        });
  
        const wompiResponse = await this.handleResponse<WompiPaymentResponse>(response);
  
        return {
          id: wompiResponse.id,
          reference: wompiResponse.reference,
          status: this.mapWompiStatus(wompiResponse.status),
          amount: wompiResponse.amount_in_cents / 100, // Convert back to units
          productId: 0, // Placeholder, as productId isn't part of the response
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create payment');
      }
    }
  
    async tokenizeCard(cardData: CardTokenizationRequest): Promise<string> {
      try {
        const response = await fetch(`${this.API_URL}/tokens/cards`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.PUBLIC_KEY}`,
          },
          body: JSON.stringify(cardData),
        });
  
        const tokenResponse = await this.handleResponse<{ id: string }>(response);
        return tokenResponse.id;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to tokenize card');
      }
    }
  
    async getPaymentStatus(transactionId: string, productId: number): Promise<Transaction> {
      try {
        const response = await fetch(`${this.API_URL}/transactions/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${this.PUBLIC_KEY}`,
          },
        });
  
        const wompiResponse = await this.handleResponse<WompiPaymentResponse>(response);
  
        return {
          id: wompiResponse.id,
          reference: wompiResponse.reference,
          status: this.mapWompiStatus(wompiResponse.status),
          amount: wompiResponse.amount_in_cents / 100, // Convert back to units
          productId: productId, // Pass through productId
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to get payment status');
      }
    }
  }
  
  const wompiService = new WompiService();
  export default wompiService;