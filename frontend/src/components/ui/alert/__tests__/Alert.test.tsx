// src/components/ui/alert/__tests__/Alert.test.tsx
import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from '../alert';

describe('Alert', () => {
  it('renders with default variant', () => {
    render(
      <Alert data-testid="alert-element">
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert-element');
    expect(alert).toHaveClass('bg-blue-50');
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders with destructive variant', () => {
    render(
      <Alert variant="destructive" data-testid="alert-element">
        <AlertTitle>Error Title</AlertTitle>
        <AlertDescription>Error Description</AlertDescription>
      </Alert>
    );

    const alert = screen.getByTestId('alert-element');
    expect(alert).toHaveClass('bg-red-50');
  });
});