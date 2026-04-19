import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { showToast } from '../components/Toast'
import { generateOrderPDF } from '../utils/generatePDF'

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const navigate = useNavigate()

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return

    setLoading(true)
    setOrder(null)
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
      const { data } = await axios.get(`${baseURL}/orders/track/${orderNumber}`)
      setOrder(data.data)
    } catch (err) {
      showToast(err.response?.data?.error || 'Order not found', 'error')
    } finally {
      setLoading(false)
    }
  }

  const downloadBill = () => {
    if (!order) return
    generateOrderPDF(order)
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-black/10 p-8 md:p-12">
          
          <h1 className="font-display text-3xl text-black mb-2 text-center">
            Track Order
          </h1>
          <p className="text-black/40 text-sm mb-8 text-center uppercase tracking-widest">
            Enter your Order ID to see details
          </p>

          <form onSubmit={handleTrack} className="flex gap-2 mb-10">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ORD-20240101-1234"
              className="flex-1 border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black transition-colors"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-black text-white text-[10px] tracking-widest uppercase font-medium hover:bg-gold hover:text-black transition-colors disabled:bg-black/30"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {order && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Status Header */}
              <div className="flex justify-between items-center pb-6 border-b border-black/10">
                <div>
                  <p className="text-[10px] text-black/30 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-display text-2xl text-gold uppercase tracking-wide">
                    {order.status}
                  </p>
                </div>
                <button
                  onClick={downloadBill}
                  className="text-[10px] border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors uppercase tracking-widest font-medium"
                >
                  📄 Download Bill
                </button>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-[10px] text-black/30 uppercase tracking-widest mb-1">Customer</p>
                  <p className="text-black font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-black/30 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-black font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <p className="text-[10px] text-black/30 uppercase tracking-widest mb-3">Items</p>
                <div className="space-y-3 bg-cream/50 p-4 border border-black/5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-black/70">
                        {item.product_name} <span className="text-black/30">× {item.quantity}</span>
                      </span>
                      <span className="font-medium">₹{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-black/10 flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span className="text-gold">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/5 p-4 rounded-sm flex items-center gap-3">
                 <span className="text-lg">💡</span>
                 <p className="text-xs text-black/60 leading-relaxed">
                   Need help? Message us on WhatsApp with your Order ID for instant support.
                 </p>
              </div>
            </div>
          )}

          {!order && !loading && (
            <div className="text-center py-12 border-2 border-dashed border-black/5">
               <p className="text-black/20 text-sm">Waiting for Order ID...</p>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 text-[10px] text-black/40 hover:text-black uppercase tracking-widest font-medium transition-colors block mx-auto"
        >
          ← Back to Shopping
        </button>
      </div>
    </div>
  )
}
