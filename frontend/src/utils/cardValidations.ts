// Utilidades para validación de tarjetas de crédito
export const cardValidations = {
    // Detecta el tipo de tarjeta basado en el número
    getCardType: (number: string): 'visa' | 'mastercard' | 'unknown' => {
      const cleanNumber = number.replace(/\s+/g, '');
      
      if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleanNumber)) {
        return 'visa';
      }
      if (/^5[1-5][0-9]{14}$/.test(cleanNumber)) {
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
      const expiry = new Date(parseInt(`20${year}`), parseInt(month) - 1);
      return expiry > currentDate;
    },
  
    // Valida el código CVV
    validateCVV: (cvv: string): boolean => {
      return /^[0-9]{3,4}$/.test(cvv);
    }
  };