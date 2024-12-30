// src/components/ui/dialog.tsx

import React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

export const DialogHeader: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};

export const DialogTitle: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <h2 className="text-xl font-bold">{children}</h2>;
};