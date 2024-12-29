// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProductPage from './pages/ProductPage';
import PaymentPage from './pages/PaymentPage';
import StatusPage from './pages/StatusPage';
import SummaryPage from './pages/SummaryPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<ProductPage />} />
          <Route path="/checkout/:productId" element={<PaymentPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/status" element={<StatusPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;