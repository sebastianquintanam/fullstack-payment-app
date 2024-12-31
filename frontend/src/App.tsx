// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import ProductPage from './pages/ProductPage'
import { ErrorPage } from './pages/ErrorPage'
import { StatusPage } from './pages/StatusPage'
import { SuccessPage } from './pages/SuccessPage'
import PaymentPage from './pages/PaymentPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/status" element={<StatusPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default App