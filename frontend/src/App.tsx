// /frontend/src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './pages/ProductPage';
import PaymentPage from './pages/PaymentPage';
import { SuccessPage } from './pages/SuccessPage';
import { ErrorPage } from './pages/ErrorPage';
import { StatusPage } from './pages/StatusPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/status" element={<StatusPage />} />
    </Routes>
  );
};

export default App;