import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadCategories() }, [])
  useEffect(() => { loadProducts(selectedCategory) }, [selectedCategory])

  const loadCategories = async () => {
    try {
      const { data } = await getCategories()
      setCategories(data.data || [])
    } catch {
      console.log('No categories')
    }
  }

  const loadProducts = async (categoryId) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getProducts(categoryId)
      setProducts(data.data || [])
    } catch {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6">
            New Collection · 2026
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-tight mb-6">
            Dressed to<br />
            <em className="text-gold">Impress</em>
          </h1>
          <p className="text-white/50 text-sm max-w-xs mx-auto leading-relaxed mb-10">
            Premium suits and women's fashion curated for the modern Indian woman.
          </p>
          <button
            onClick={() =>
              document.getElementById('products')
                .scrollIntoView({ behavior: 'smooth' })
            }
            className="px-10 py-3.5 border border-gold text-gold hover:bg-gold hover:text-black text-xs tracking-widest uppercase font-medium transition-colors"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="bg-gold text-black py-2.5 text-center">
        <p className="text-[11px] tracking-[0.2em] uppercase font-medium">
          Free delivery on orders above ₹999 · Hyderabad
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            {['', ...categories.map(c => c.id)].map((id, idx) => {
              const label = id === '' ? 'All' : categories.find(c => c.id === id)?.name
              return (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`px-5 py-2 text-xs tracking-widest uppercase font-medium border transition-colors
                    ${selectedCategory === id
                      ? 'bg-black border-black text-white'
                      : 'border-black/20 text-black/60 hover:border-black hover:text-black bg-white'
                    }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}

        {/* Section Title */}
        <div id="products" className="flex items-center gap-6 mb-10">
          <div className="flex-1 h-px bg-black/10" />
          <h2 className="font-display text-2xl text-black tracking-wide">
            Our Collection
          </h2>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white animate-pulse border border-black/5">
                <div className="w-full h-72 bg-offwhite" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-offwhite rounded w-3/4" />
                  <div className="h-3 bg-offwhite rounded w-1/2" />
                  <div className="h-9 bg-offwhite rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-black mb-2">
              Something went wrong
            </p>
            <p className="text-black/40 text-sm mb-6">{error}</p>
            <button
              onClick={() => loadProducts(selectedCategory)}
              className="px-8 py-3 bg-black text-white text-xs tracking-widest uppercase hover:bg-gold hover:text-black transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-black mb-2">
              No items found
            </p>
            <p className="text-black/40 text-sm">
              Check back soon for new arrivals
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-black text-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h3 className="font-display text-3xl text-white mb-1">
            Vastralaya
          </h3>
          <p className="text-[10px] text-gold tracking-[0.3em] uppercase mb-6">
            Women's Fashion · Hyderabad
          </p>
          <div className="w-px h-8 bg-white/10 mx-auto mb-6" />
          <p className="text-white/20 text-xs tracking-wide">
            © 2026 Vastralaya · All orders via WhatsApp
          </p>
        </div>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <Link 
          to="/"
          className="flex items-center gap-3 bg-black text-white px-6 py-4 border border-gold/30 shadow-2xl hover:bg-gold hover:text-black transition-all group"
        >
          <div className="text-xl group-hover:scale-125 transition-transform">🚀</div>
          <div className="text-left">
            <p className="text-[8px] uppercase tracking-widest text-gold/60 leading-none mb-1">Business</p>
            <p className="text-[10px] uppercase tracking-widest font-bold leading-none">Get Your Store</p>
          </div>
        </Link>
      </div>

    </div>
  )
}