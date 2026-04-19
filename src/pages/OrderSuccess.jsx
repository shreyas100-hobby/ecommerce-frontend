import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function OrderSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state?.orderData) navigate('/')
  }, [state, navigate])

  if (!state?.orderData) return null

  const { order, whatsapp_url } = state.orderData

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white border border-black/10 p-8 md:p-10 max-w-md w-full text-center">

        {/* Top accent */}
        <div className="w-12 h-0.5 bg-gold mx-auto mb-8" />

        <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-3">
          Thank You
        </p>

        <h1 className="font-display text-4xl text-black mb-3">
          Order Placed
        </h1>

        <p className="text-black/40 text-sm mb-8 leading-relaxed">
          Hi {order.customer_name}, your order has been placed.
          Please confirm on WhatsApp to complete your purchase.
        </p>

        {/* Order Details */}
        <div className="bg-cream border border-black/8 p-5 text-left mb-6">

          <div className="flex justify-between items-center mb-4 pb-4 border-b border-black/8">
            <span className="text-[10px] text-black/40 uppercase tracking-widest">
              Order No.
            </span>
            <span className="font-semibold text-black text-sm">
              {order.order_number}
            </span>
          </div>

          <div className="space-y-2.5 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-black/60 truncate pr-2">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="text-black font-medium shrink-0">
                  ₹{item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-black/8">
            <span className="font-semibold text-black text-sm">Total</span>
            <span className="font-semibold text-gold text-sm">
              ₹{order.total_amount.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-black/30 uppercase tracking-widest">
              Payment
            </span>
            <span className="text-[10px] text-black/50 uppercase tracking-widest font-medium">
              {order.payment_method}
            </span>
          </div>

        </div>

        {/* WhatsApp CTA */}
        <a
          href={whatsapp_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors mb-3"
        >
          <span>💬</span>
          Confirm on WhatsApp
        </a>

        <button
          onClick={() => navigate('/')}
          className="w-full py-4 border border-black/20 text-black/50 text-xs tracking-widest uppercase font-medium hover:border-black hover:text-black transition-colors"
        >
          Continue Shopping
        </button>

        <div className="w-12 h-0.5 bg-gold mx-auto mt-8" />

      </div>
    </div>
  )
}