// src/components/ProductCard.jsx
import { useNavigate } from 'react-router-dom'
import useCartStore from '../store/cartStore'
import { showToast } from './Toast'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { items, addItem, updateQuantity } = useCartStore()

  // For products with no variants — use product id as cartKey
  const cartKey = product.id
  const cartItem = items.find(i => i.cartKey === cartKey)
  const isUnavailable = !product.is_available || product.stock_quantity === 0
  const hasVariants = product.variants?.length > 0

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  const handleClick = () => {
    navigate(`/products/${product.id}`)
  }

  const handleAdd = (e) => {
    e.stopPropagation()
    if (hasVariants) {
      // Go to product page to select variant
      navigate(`/products/${product.id}`)
      return
    }
    addItem(product, null)
    showToast(`${product.name} added to bag`, 'success')
  }

  return (
    <div
      className="bg-white group border border-black/5 hover:border-black/20 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-offwhite shrink-0">
        <img
          src={
            product.images?.[0]?.url ||
            product.image_url ||
            `https://picsum.photos/seed/${product.id}/400/500`
          }
          alt={product.name}
          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
          onError={e => e.target.src = 'https://picsum.photos/400/500'}
        />

        {discount && (
          <span className="absolute top-3 left-3 bg-gold text-black text-[10px] font-semibold px-2.5 py-1 tracking-widest uppercase">
            {discount}% Off
          </span>
        )}

        {isUnavailable && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <span className="text-black text-xs tracking-[0.3em] uppercase font-bold bg-white/90 px-4 py-2">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick view on hover */}
        {!isUnavailable && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-[10px] tracking-widest uppercase">
              {hasVariants ? 'Select Options' : 'Quick Add'}
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 border-t border-black/5 flex flex-col flex-1">
        <h3 className="font-display text-base text-black mb-1 truncate">
          {product.name}
        </h3>

        {/* Bottom Section (Pushed to bottom) */}
        <div className="mt-auto pt-3 flex flex-col gap-3">
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-black font-semibold text-sm">
              ₹{product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-black/30 text-xs line-through">
                ₹{product.original_price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Variant chips preview */}
          {hasVariants && (
            <div className="flex gap-1 flex-wrap">
              {[...new Set(product.variants.map(v => v.color))]
                .slice(0, 4)
                .map(color => (
                  <span
                    key={color}
                    className="text-[9px] px-1.5 py-0.5 border border-black/10 text-black/40 uppercase tracking-wide"
                  >
                    {color}
                  </span>
                ))
              }
              {[...new Set(product.variants.map(v => v.color))].length > 4 && (
                <span className="text-[9px] px-1.5 py-0.5 text-black/30">
                  +{[...new Set(product.variants.map(v => v.color))].length - 4} more
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          {isUnavailable ? (
            <button
              disabled
              className="w-full py-2.5 text-xs tracking-widest uppercase font-medium text-black/30 border border-black/10 cursor-not-allowed mt-1"
            >
              Sold Out
            </button>

          ) : hasVariants ? (
            <button
              onClick={handleAdd}
              className="w-full py-2.5 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors mt-1"
            >
              Select Options
            </button>

          ) : cartItem ? (
            <div
              className="flex items-center justify-between border border-black mt-1"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => updateQuantity(cartKey, cartItem.quantity - 1)}
                className="px-4 py-2.5 text-black hover:bg-black hover:text-white transition-colors text-lg font-light"
              >
                −
              </button>
              <span className="text-black font-medium text-sm">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(cartKey, cartItem.quantity + 1)}
                className="px-4 py-2.5 text-black hover:bg-black hover:text-white transition-colors text-lg font-light"
              >
                +
              </button>
            </div>

          ) : (
            <button
              onClick={handleAdd}
              className="w-full py-2.5 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors mt-1"
            >
              Add to Bag
            </button>
          )}
        </div>
      </div>
    </div>
  )
}