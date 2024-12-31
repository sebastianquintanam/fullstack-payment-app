// /frontend/src/utils/cardValidations.ts

// Tipos de tarjetas y sus patrones
const CARD_PATTERNS = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/
  };
  
  // Utilidades para validación de tarjetas de crédito
  export const cardValidations = {
    // Detecta el tipo de tarjeta basado en el número
    getCardType: (number: string): 'visa' | 'mastercard' | 'unknown' => {
      const cleanNumber = number.replace(/\s+/g, '');
      
      if (CARD_PATTERNS.visa.test(cleanNumber)) {
        return 'visa';
      }
      if (CARD_PATTERNS.mastercard.test(cleanNumber)) {
        return 'mastercard';
      }
      return 'unknown';
    },
  
    // Valida el número de tarjeta usando el algoritmo de Luhn
    validateCardNumber: (number: string): boolean => {
      const cleanNumber = number.replace(/\s+/g, '');
      if (!/^\d+$/.test(cleanNumber)) return false;
      
      let sum = 0;
      let isEven = false;
      
      for (let i = cleanNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cleanNumber[i]);
        
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        
        sum += digit;
        isEven = !isEven;
      }
      
      return sum % 10 === 0;
    },
  
    // Valida la fecha de expiración
    validateExpiry: (month: string, year: string): boolean => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
  
      const expMonth = parseInt(month);
      const expYear = parseInt(year);
  
      if (expYear < currentYear) return false;
      if (expYear === currentYear && expMonth < currentMonth) return false;
      if (expMonth < 1 || expMonth > 12) return false;
  
      return true;
    },
  
    // Valida el código CVV
    validateCVV: (cvv: string): boolean => {
      return /^[0-9]{3,4}$/.test(cvv);
    },
  
    // Valida el nombre del titular
    validateCardHolder: (name: string): boolean => {
      return name.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(name);
    },
  
    // Función de validación general que devuelve errores específicos
    validateCardData: (cardData: {
      number: string;
      exp_month: string;
      exp_year: string;
      cvc: string;
      card_holder: string;
    }): { isValid: boolean; errors: Record<string, string> } => {
      const errors: Record<string, string> = {};
  
      // Validar número de tarjeta
      if (!cardValidations.validateCardNumber(cardData.number)) {
        errors.number = 'Número de tarjeta inválido';
      } else if (cardValidations.getCardType(cardData.number) === 'unknown') {
        errors.number = 'Solo se aceptan tarjetas Visa o Mastercard';
      }
  
      // Validar fecha de expiración
      if (!cardValidations.validateExpiry(cardData.exp_month, cardData.exp_year)) {
        errors.expiry = 'Fecha de expiración inválida';
      }
  
      // Validar CVV
      if (!cardValidations.validateCVV(cardData.cvc)) {
        errors.cvv = 'CVV inválido';
      }
  
      // Validar titular
      if (!cardValidations.validateCardHolder(cardData.card_holder)) {
        errors.cardHolder = 'Nombre del titular inválido';
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    },
  
    // Formatea el número de tarjeta para mostrar espacios cada 4 dígitos
    formatCardNumber: (number: string): string => {
      const cleanNumber = number.replace(/\s+/g, '');
      return cleanNumber.replace(/(\d{4})/g, '$1 ').trim();
    },
  
    // Formatea la fecha de expiración automáticamente
    formatExpiry: (value: string): string => {
      const cleanValue = value.replace(/\D+/g, '');
      if (cleanValue.length >= 2) {
        return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
      }
      return cleanValue;
    }
  };