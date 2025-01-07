// /frontend/src/components/ui/alert.tsx
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-blue-50 text-blue-700 border-blue-200',
    destructive: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className={`p-4 rounded-md border ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="font-medium mb-1">{children}</h3>
);

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm">{children}</div>
);