// src/components/ui/dialog.tsx

import React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void; // Optional prop
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  // Close the dialog when the overlay is clicked, if onOpenChange is provided
  const handleOverlayClick = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={handleOverlayClick} // Close dialog on overlay click
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full m-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};

export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h2 className="text-xl font-bold">{children}</h2>;
};
