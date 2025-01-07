// src/components/product/ProductCard/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../index';
import userEvent from '@testing-library/user-event';

describe('ProductCard', () => {
  const mockProps = {
    id: 1,
    name: 'iPhone 15',
    description: 'iPhone 15 128GB Negro',
    price: 999.99,
    stock: 15,
    onClick: jest.fn()
  };

  it('renders product information correctly', () => {
    render(<ProductCard {...mockProps} />);
    
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProps.price}`)).toBeInTheDocument();
    expect(screen.getByText(`Stock: ${mockProps.stock}`)).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    render(<ProductCard {...mockProps} />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(mockProps.onClick).toHaveBeenCalledWith(mockProps.id);
  });
});