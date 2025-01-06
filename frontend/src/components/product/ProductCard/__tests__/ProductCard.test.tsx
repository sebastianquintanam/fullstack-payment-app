// src/components/product/ProductCard/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../index';

describe('ProductCard', () => {
  // Asegúrate que el mockProduct coincida exactamente con las props que espera el componente
  const mockProduct = {
    id: 1,
    name: 'iPhone 15',
    description: 'iPhone 15 128GB Negro',
    price: 999.99,
    stock: 15
  };

  const mockOnClick = jest.fn();

  it('renders product information correctly', () => {
    render(
      <ProductCard
        id={mockProduct.id}
        name={mockProduct.name}
        description={mockProduct.description}
        price={mockProduct.price}
        stock={mockProduct.stock}
        onClick={mockOnClick}
      />
    );

    // Verifica los elementos
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(`Stock: ${mockProduct.stock}`)).toBeInTheDocument();
  });
});