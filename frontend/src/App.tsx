// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import ErrorPage from './pages/ErrorPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path="/payment/:productId" element={<PaymentPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;