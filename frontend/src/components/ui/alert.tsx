// src/components/ui/alert.tsx
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const baseStyles = "p-4 rounded-lg";
  const variantStyles = {
    default: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};