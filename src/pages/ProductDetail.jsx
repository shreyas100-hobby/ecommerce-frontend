// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, getProducts } from '../api'
import useCartStore from '../store/cartStore'
import { showToast } from '../components/Toast'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { items, addItem, updateQuantity, openCart } = useCartStore()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Gallery
  const [activeImage, setActiveImage] = useState(0)
  
  // Image Zoom
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  // Variant selection
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    // Scroll to top on id change
    window.scrollTo(0, 0)
    loadProduct()
  }, [id])

  useEffect(() => {
    if (product?.variants?.length > 0 && !selectedColor) {
      const uniqueColors = [...new Set(product.variants.map(v => v.color))]
      // Try to find a color with stock
      const availableColor = uniqueColors.find(color => 
        product.variants.some(v => v.color === color && v.stock_quantity > 0)
      )
      setSelectedColor(availableColor || uniqueColors[0])
    }
  }, [product])

  const loadProduct = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getProduct(id)
      setProduct(data.data)

      // Fetch related products (same category or all)
      const relatedRes = await getProducts(data.data.category_id || '')
      const filtered = (relatedRes.data.data || [])
        .filter(p => p.id !== id)
        .slice(0, 4) // Show up to 4 related products
      
      // If we didn't get enough related products from the category, fetch some random ones
      if (filtered.length < 4) {
         const allRes = await getProducts()
         const more = (allRes.data.data || [])
           .filter(p => p.id !== id && !filtered.find(fp => fp.id === p.id))
           .slice(0, 4 - filtered.length)
         setRelatedProducts([...filtered, ...more])
      } else {
         setRelatedProducts(filtered)
      }

    } catch {
      setError('Product not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <ProductDetailSkeleton />
  if (error || !product) return <ProductNotFound navigate={navigate} />

  // ── Variant Logic ─────────────────────────────────

  const hasVariants = product.variants?.length > 0

  // Unique colors
  const colors = [...new Set(product.variants?.map(v => v.color) || [])]

  // Sizes available for selected color
  const sizesForColor = selectedColor
    ? product.variants
        .filter(v => v.color === selectedColor)
        .map(v => ({ size: v.size, stock: v.stock_quantity, id: v.id }))
    : []

  // Selected variant object
  const selectedVariant = selectedColor && selectedSize
    ? product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
      )
    : null

  // Stock for selected variant
  const variantStock = selectedVariant?.stock_quantity ?? 0

  // Cart key for this selection
  const cartKey = selectedVariant
    ? `${product.id}_${selectedVariant.id}`
    : product.id

  const cartItem = items.find(i => i.cartKey === cartKey)

  // Overall availability
  const isUnavailable = !product.is_available

  // ── Add to Bag ────────────────────────────────────

  const handleAddToBag = () => {
    if (hasVariants && !selectedColor) {
      showToast('Please select a color', 'error')
      return
    }
    if (hasVariants && !selectedSize) {
      showToast('Please select a size', 'error')
      return
    }
    if (hasVariants && variantStock === 0) {
      showToast('This variant is out of stock', 'error')
      return
    }

    addItem(product, selectedVariant)
    showToast(`${product.name} added to bag`, 'success')
    openCart()
  }

  // ── Discount ──────────────────────────────────────
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null

  // ── Images ────────────────────────────────────────
  const images = product.images?.length > 0
    ? product.images
    : [{ url: product.image_url || `https://picsum.photos/seed/${product.id}/800` }]

  return (
    <div className="min-h-screen bg-cream">

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-[10px] text-black/30 uppercase tracking-widest">
          <button
            onClick={() => navigate('/')}
            className="hover:text-black transition-colors"
          >
            Home
          </button>
          <span>/</span>
          {product.category_name && (
            <>
              <span>{product.category_name}</span>
              <span>/</span>
            </>
          )}
          <span className="text-black/60 truncate max-w-xs">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Left: Image Gallery ── */}
          <div className="space-y-3">

            {/* Main Image with Zoom */}
            <div 
              className="relative bg-offwhite overflow-hidden aspect-[3/4] cursor-crosshair group"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={images[activeImage]?.url || images[0]?.url}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`}
                style={{
                  transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : 'center center'
                }}
                onError={e =>
                  e.target.src = `https://picsum.photos/seed/${product.id}/800`
                }
              />

              {discount && (
                <span className="absolute top-4 left-4 bg-gold text-black text-[10px] font-semibold px-3 py-1.5 tracking-widest uppercase z-10 pointer-events-none">
                  {discount}% Off
                </span>
              )}

              {/* Arrow navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImage(i => i === 0 ? images.length - 1 : i - 1)
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center text-black transition-colors z-20 pointer-events-auto"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImage(i => i === images.length - 1 ? 0 : i + 1)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center text-black transition-colors z-20 pointer-events-auto"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`shrink-0 w-[72px] h-[96px] overflow-hidden transition-all duration-300
                      ${activeImage === index
                        ? 'opacity-100 border-2 border-black scale-95'
                        : 'opacity-50 hover:opacity-100 border-2 border-transparent'
                      }`}
                  >
                    <img
                      src={img.url}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={e =>
                        e.target.src = 'https://picsum.photos/100'
                      }
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Product Info ── */}
          <div className="space-y-6 py-2">

            {/* Category */}
            {product.category_name && (
              <p className="text-[10px] text-black/30 tracking-[0.3em] uppercase">
                {product.category_name}
              </p>
            )}

            {/* Name */}
            <h1 className="font-display text-3xl md:text-4xl text-black leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-black">
                ₹{product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-black/30 line-through text-base">
                    ₹{product.original_price.toFixed(2)}
                  </span>
                  <span className="text-xs bg-gold/20 text-gold-dark px-2 py-0.5 font-medium">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            <div className="w-12 h-px bg-black/10" />

            {/* ── Color Selector ── */}
            {hasVariants && colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-black/40 tracking-widests uppercase font-medium">
                    Color
                  </p>
                  {selectedColor && (
                    <p className="text-xs text-black font-medium">
                      {selectedColor}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => {
                    // Check if color has any stock
                    const colorStock = product.variants
                      .filter(v => v.color === color)
                      .reduce((sum, v) => sum + v.stock_quantity, 0)

                    return (
                      <button
                        key={color}
                        onClick={() => {
                          setSelectedColor(color)
                          setSelectedSize(null) // reset size on color change
                        }}
                        disabled={colorStock === 0}
                        className={`px-4 py-2 text-xs border font-medium tracking-wide transition-colors
                          ${colorStock === 0
                            ? 'border-black/10 text-black/20 cursor-not-allowed line-through'
                            : selectedColor === color
                              ? 'bg-black border-black text-white'
                              : 'border-black/20 text-black/60 hover:border-black hover:text-black'
                          }`}
                      >
                        {color}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Size Selector ── */}
            {hasVariants && selectedColor && sizesForColor.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-black/40 tracking-widests uppercase font-medium">
                    Size
                  </p>
                  {selectedSize && (
                    <p className="text-xs text-black font-medium">
                      {selectedSize}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizesForColor.map(({ size, stock, id }) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={stock === 0}
                      className={`min-w-[48px] px-3 py-2 text-xs border font-medium transition-colors
                        ${stock === 0
                          ? 'border-black/10 text-black/20 cursor-not-allowed relative overflow-hidden'
                          : selectedSize === size
                            ? 'bg-black border-black text-white'
                            : 'border-black/20 text-black/60 hover:border-black hover:text-black'
                        }`}
                    >
                      {size}
                      {/* Cross line for out of stock */}
                      {stock === 0 && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="absolute w-full h-px bg-black/20 rotate-45" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Stock warning */}
                {selectedVariant && variantStock > 0 && variantStock <= 5 && (
                  <p className="text-xs text-red-500 mt-2">
                    ⚠ Only {variantStock} left in stock!
                  </p>
                )}
              </div>
            )}

            {/* ── Add to Bag ── */}
            <div className="pt-2">
              {isUnavailable ? (
                <button
                  disabled
                  className="w-full py-4 border border-black/10 text-black/30 text-xs tracking-widests uppercase cursor-not-allowed"
                >
                  Currently Unavailable
                </button>

              ) : cartItem ? (
                <div className="space-y-3">
                  <div className="flex items-center border border-black">
                    <button
                      onClick={() =>
                        updateQuantity(cartKey, cartItem.quantity - 1)
                      }
                      className="px-6 py-4 text-black hover:bg-black hover:text-white transition-colors text-xl font-light"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-medium text-black">
                      {cartItem.quantity} in bag
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(cartKey, cartItem.quantity + 1)
                      }
                      className="px-6 py-4 text-black hover:bg-black hover:text-white transition-colors text-xl font-light"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={openCart}
                    className="w-full py-4 border border-black text-black text-xs tracking-widests uppercase font-medium hover:bg-black hover:text-white transition-colors"
                  >
                    View Bag →
                  </button>
                </div>

              ) : (
                <button
                  onClick={handleAddToBag}
                  className="w-full py-4 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widests uppercase font-medium transition-colors"
                >
                  {hasVariants && (!selectedColor || !selectedSize)
                    ? 'Select Options to Add'
                    : 'Add to Bag'
                  }
                </button>
              )}
            </div>

            {/* Accordions */}
            <div className="pt-8 space-y-0 border-t border-black/10 mt-8">
              <Accordion title="Product Details" defaultOpen={true}>
                <p className="mb-2">
                  {product.description || "Designed for modern elegance, this beautiful piece features a timeless silhouette that effortlessly elevates any wardrobe."}
                </p>
                <ul className="list-disc pl-4 space-y-1 mt-3">
                  <li>Regular fit</li>
                  <li>Ethically sourced materials</li>
                  <li>Designed in-house</li>
                  <li>SKU: {product.id.slice(0, 8).toUpperCase()}</li>
                </ul>
              </Accordion>
              
              <Accordion title="Shipping & Returns">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span>📦</span>
                    <span>Free standard shipping on orders over ₹999. Usually arrives in 3-5 business days.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>↩️</span>
                    <span>Easy 7-day returns for all unworn items with tags attached.</span>
                  </li>
                </ul>
              </Accordion>
              
              <Accordion title="Fabric & Care">
                <p className="mb-2">Premium quality fabric designed for comfort and durability.</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Machine wash cold with like colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low or hang to dry</li>
                  <li>Iron on low heat if needed</li>
                </ul>
              </Accordion>
            </div>

          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16 border-t border-black/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-2xl md:text-3xl text-black">
              You May Also Like
            </h2>
            <button 
              onClick={() => navigate('/')}
              className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition-colors"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────
function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-[3/4] bg-offwhite" />
          <div className="space-y-4 py-4">
            <div className="h-3 bg-offwhite w-24" />
            <div className="h-8 bg-offwhite w-3/4" />
            <div className="h-6 bg-offwhite w-1/3" />
            <div className="h-px bg-offwhite" />
            <div className="h-4 bg-offwhite w-full" />
            <div className="h-4 bg-offwhite w-2/3" />
            <div className="h-12 bg-offwhite w-full mt-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Not Found ─────────────────────────────────────────────────
function ProductNotFound({ navigate }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <p className="font-display text-3xl text-black mb-2">
          Product Not Found
        </p>
        <p className="text-black/40 text-sm mb-8">
          This product may no longer be available
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-black text-white text-xs tracking-widests uppercase hover:bg-gold hover:text-black transition-colors"
        >
          Back to Shop
        </button>
      </div>
    </div>
  )
}

// ── Accordion ─────────────────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-black/10">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex justify-between items-center text-xs tracking-widest uppercase font-medium text-black group"
      >
        <span>{title}</span>
        <span className="text-lg font-light text-black/40 group-hover:text-black transition-colors">
          {open ? '−' : '+'}
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="text-sm text-black/60 font-light leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}