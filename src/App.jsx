// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartSidebar from './components/CartSidebar'
import Toast from './components/Toast'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import OrderSuccess from './pages/OrderSuccess'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import useAdminStore from './store/adminStore'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdminStore()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return children
}

function CustomerLayout() {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
        <Route path="/*" element={<CustomerLayout />} />
      </Routes>
    </BrowserRouter>
  )
}