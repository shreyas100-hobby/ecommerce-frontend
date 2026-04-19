import { Link } from 'react-router-dom'
import useCartStore from '../store/cartStore'

export default function Navbar() {
  const { items, openCart } = useCartStore()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <nav className="bg-white border-b border-black/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="block hover:opacity-80 transition-opacity">
          <h1 className="font-display text-2xl text-black tracking-wide">
            Vastralaya
          </h1>
          <p className="text-[10px] text-black/40 tracking-[0.3em] uppercase">
            Women's Fashion
          </p>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            to="/track" 
            className="text-[10px] text-black/40 hover:text-black uppercase tracking-widest font-medium transition-colors hidden md:block"
          >
            Track Order
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2.5 border border-black text-black hover:bg-black hover:text-white px-5 py-2.5 text-xs tracking-widest uppercase font-medium transition-colors"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Bag
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-black text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </button>
        </div>

      </div>
    </nav>
  )
}