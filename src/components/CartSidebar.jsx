import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import { createOrder } from '../api'
import { showToast } from './Toast'

export default function CartSidebar() {
  const navigate = useNavigate()
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartStore()

  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    payment_method: 'cod',
    note: '',
  })

  const totalPrice = items.reduce(
    (sum, i) => sum + i.price * i.quantity, 0
  )

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () => setForm({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    payment_method: 'cod',
    note: '',
  })

  const handlePlaceOrder = async () => {
    if (!form.customer_name.trim()) {
      showToast('Please enter your name', 'error')
      return
    }
    if (!form.customer_phone.trim() || form.customer_phone.length < 10) {
      showToast('Enter a valid phone number', 'error')
      return
    }

    setLoading(true)
    try {
      const { data } = await createOrder({
        ...form,
        items: items.map(i => ({
          product_id: i.id,
          variant_id: i.variantId || null,
          quantity: i.quantity,
          color: i.color || '',
          size: i.size || '',
          image_url: i.image_url || '',
        }))
      })

      clearCart()
      closeCart()
      setShowForm(false)
      resetForm()
      navigate('/order-success', { state: { orderData: data } })

    } catch (err) {
      showToast(
        err?.response?.data?.error || 'Failed to place order',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `
    w-full border border-black/20 bg-white px-4 py-3
    text-sm text-black outline-none
    focus:border-black placeholder:text-black/30
    transition-colors
  `

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[200]"
        onClick={() => {
          closeCart()
          setShowForm(false)
        }}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-cream z-[300] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 bg-white border-b border-black/10">
          <div>
            <h2 className="font-display text-xl text-black">
              {showForm ? 'Your Details' : 'Your Bag'}
            </h2>
            {!showForm && items.length > 0 && (
              <p className="text-[11px] text-black/40 tracking-widest uppercase mt-0.5">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </p>
            )}
          </div>
          <button
            onClick={() => {
              closeCart()
              setShowForm(false)
            }}
            className="text-black/40 hover:text-black text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Cart Items ── */}
        {!showForm && (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="text-center mt-24">
                <div className="text-4xl mb-4">🛍️</div>
                <p className="font-display text-xl text-black mb-2">
                  Your bag is empty
                </p>
                <p className="text-black/40 text-sm">
                  Add something beautiful
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map(item => (
                  <div
                    key={item.cartKey}
                    className="flex gap-4 bg-white border border-black/5 p-3"
                  >
                    {/* Image */}
                    <img
                      src={
                        item.image_url ||
                        `https://picsum.photos/seed/${item.id}/100`
                      }
                      alt={item.name}
                      className="w-20 h-20 object-cover bg-offwhite shrink-0"
                      onError={e =>
                        e.target.src = 'https://picsum.photos/100'
                      }
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm text-black truncate">
                        {item.name}
                      </p>

                      {/* Color + Size */}
                      {(item.color || item.size) && (
                        <p className="text-[10px] text-black/30 uppercase tracking-widest mt-0.5">
                          {[item.color, item.size]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}

                      <p className="text-gold font-medium text-sm mt-1">
                        ₹{item.price.toFixed(2)}
                      </p>

                      {/* Qty Controls */}
                      <div className="flex items-center mt-2 border border-black/20 w-fit">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartKey, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-medium text-black border-x border-black/20">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartKey, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col justify-between items-end shrink-0">
                      <button
                        onClick={() => removeItem(item.cartKey)}
                        className="text-black/20 hover:text-black text-sm transition-colors"
                      >
                        ✕
                      </button>
                      <p className="text-xs font-semibold text-black">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Order Form ── */}
        {showForm && (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

            <div>
              <label className="block text-[10px] font-medium text-black/50 mb-1.5 tracking-widest uppercase">
                Full Name <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-black/50 mb-1.5 tracking-widest uppercase">
                Phone Number <span className="text-gold">*</span>
              </label>
              <input
                type="tel"
                name="customer_phone"
                value={form.customer_phone}
                onChange={handleChange}
                placeholder="10 digit number"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-black/50 mb-1.5 tracking-widest uppercase">
                Delivery Address
              </label>
              <textarea
                name="customer_address"
                value={form.customer_address}
                onChange={handleChange}
                placeholder="Your full address"
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-black/50 mb-1.5 tracking-widest uppercase">
                Payment Method
              </label>
              <select
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-black/50 mb-1.5 tracking-widest uppercase">
                Special Note
              </label>
              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Any special instructions?"
                className={inputClass}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-black/10 p-4">
              <p className="text-[10px] font-medium text-black/40 uppercase tracking-widest mb-3">
                Order Summary
              </p>
              <div className="space-y-2">
                {items.map(item => (
                  <div
                    key={item.cartKey}
                    className="flex justify-between text-sm"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-black/70 truncate">
                        {item.name} × {item.quantity}
                      </p>
                      {(item.color || item.size) && (
                        <p className="text-[10px] text-black/30 uppercase tracking-widest">
                          {[item.color, item.size]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                    </div>
                    <span className="font-medium text-black shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold text-black pt-3 mt-2 border-t border-black/10">
                <span>Total</span>
                <span className="text-gold">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ── Footer ── */}
        <div className="px-6 py-5 bg-white border-t border-black/10">
          {!showForm ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-display text-lg text-black">
                  Total
                </span>
                <span className="font-semibold text-black text-lg">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => setShowForm(true)}
                disabled={items.length === 0}
                className="w-full py-4 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors disabled:bg-black/20 disabled:cursor-not-allowed"
              >
                Proceed to Order
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-4 border border-black/20 text-black text-xs tracking-widest uppercase font-medium hover:bg-black hover:text-white transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="flex-[2] py-4 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors disabled:bg-black/30"
              >
                {loading ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  )
}