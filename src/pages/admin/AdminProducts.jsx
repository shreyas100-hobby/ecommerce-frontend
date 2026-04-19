// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from 'react'
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getCategories,
} from '../../api'
import ImageUploader from '../../components/admin/ImageUploader'
import VariantManager from '../../components/admin/VariantManager'

const emptyForm = {
  name: '',
  description: '',
  price: '',
  original_price: '',
  category_id: '',
  is_available: true,
  images: [],
  variants: [],
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('basic') // basic | images | variants

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        adminGetProducts(),
        getCategories(),
      ])
      setProducts(productsRes.data.data || [])
      setCategories(categoriesRes.data.data || [])
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditProduct(null)
    setForm(emptyForm)
    setActiveTab('basic')
    setError('')
    setShowModal(true)
  }

    const openEdit = (product) => {
    setEditProduct(product)
    setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        category_id: product.category_id || '',
        is_available: product.is_available ?? true,
        // ✅ Load existing images and variants
        images: product.images || [],
        variants: product.variants || [],
    })
    setActiveTab('basic')
    setError('')
    setShowModal(true)
    }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

const handleSave = async (e) => {
  e.preventDefault()
  if (!form.name.trim()) {
    setError('Product name is required')
    setActiveTab('basic')
    return
  }
  if (!form.price) {
    setError('Price is required')
    setActiveTab('basic')
    return
  }

  setSaving(true)
  setError('')

  // Calculate total stock from variants
  const totalStock = form.variants.reduce(
    (sum, v) => sum + (v.stock_quantity || 0), 0
  )

  // ✅ Always send images and variants
  // Backend will replace them properly
  const payload = {
    name: form.name,
    description: form.description,
    price: parseFloat(form.price),
    original_price: form.original_price
      ? parseFloat(form.original_price)
      : null,
    category_id: form.category_id || null,
    image_url: form.images[0]?.url || '',
    stock_quantity: totalStock,
    is_available: form.is_available,
    images: form.images,       // always send
    variants: form.variants,   // always send
  }

  try {
    if (editProduct) {
      await adminUpdateProduct(editProduct.id, payload)
    } else {
      await adminCreateProduct(payload)
    }
    await loadData()
    setShowModal(false)
  } catch (err) {
    setError(err?.response?.data?.error || 'Failed to save product')
  } finally {
    setSaving(false)
  }
}

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await adminDeleteProduct(id)
      await loadData()
    } catch {
      alert('Failed to delete product')
    }
  }

  const inputClass = "w-full border border-black/20 px-3 py-2.5 text-sm text-black outline-none focus:border-black bg-white placeholder:text-black/20"

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'images', label: `Images (${form.images.length})` },
    { id: 'variants', label: `Variants (${form.variants.length})` },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-3xl text-black">Products</h2>
          <p className="text-black/40 text-sm mt-1">
            {products.length} items
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-6 py-2.5 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-black/10">
        {loading ? (
          <div className="p-12 text-center text-black/30 text-sm">
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-xl text-black mb-2">
              No products yet
            </p>
            <p className="text-black/30 text-sm mb-6">
              Add your first product
            </p>
            <button
              onClick={openAdd}
              className="px-6 py-2.5 bg-black text-white text-xs tracking-widest uppercase"
            >
              + Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/10 bg-cream">
                  {['Product', 'Price', 'Variants', 'Stock', 'Status', 'Actions'].map(h => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-[10px] tracking-widest uppercase text-black/40 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {products.map(p => (
                  <tr
                    key={p.id}
                    className="hover:bg-cream transition-colors"
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            p.images?.[0]?.url ||
                            p.image_url ||
                            `https://picsum.photos/seed/${p.id}/60`
                          }
                          alt={p.name}
                          className="w-12 h-12 object-cover bg-offwhite border border-black/5"
                          onError={e => e.target.src = 'https://picsum.photos/60'}
                        />
                        <div>
                          <p className="text-sm font-medium text-black">
                            {p.name}
                          </p>
                          {p.category_name && (
                            <p className="text-[10px] text-black/30 uppercase tracking-wide">
                              {p.category_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-black">
                        ₹{p.price.toFixed(2)}
                      </p>
                      {p.original_price && (
                        <p className="text-[10px] text-black/30 line-through">
                          ₹{p.original_price.toFixed(2)}
                        </p>
                      )}
                    </td>

                    {/* Variants */}
                    <td className="px-6 py-4">
                      {p.variants?.length > 0 ? (
                        <div className="space-y-1">
                          {/* Unique colors */}
                          <div className="flex flex-wrap gap-1">
                            {[...new Set(p.variants.map(v => v.color))].map(c => (
                              <span
                                key={c}
                                className="text-[9px] px-1.5 py-0.5 bg-black/5 text-black/60 uppercase tracking-wide"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                          {/* Unique sizes */}
                          <div className="flex flex-wrap gap-1">
                            {[...new Set(p.variants.map(v => v.size))].map(s => (
                              <span
                                key={s}
                                className="text-[9px] px-1.5 py-0.5 border border-black/10 text-black/40"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-black/20">
                          No variants
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-black">
                        {p.stock_quantity}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`
                        text-[10px] px-2.5 py-1 font-medium tracking-widest uppercase
                        ${p.is_available && p.stock_quantity > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.is_available && p.stock_quantity > 0
                          ? 'Available'
                          : 'Unavailable'
                        }
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-[10px] tracking-widest uppercase text-black/40 hover:text-black transition-colors font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-[10px] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[200]"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-[300] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-black/10 flex justify-between items-center shrink-0">
              <h3 className="font-display text-xl text-black">
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-black/30 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-black/10 shrink-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-xs tracking-widest uppercase font-medium border-b-2 transition-colors
                    ${activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-black/30 hover:text-black'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
              <div className="p-6">

                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-black/40 mb-1.5 tracking-widest uppercase">
                        Product Name *
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Silk Kurta Set"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-black/40 mb-1.5 tracking-widest uppercase">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Describe the product..."
                        rows={4}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-black/40 mb-1.5 tracking-widest uppercase">
                          Selling Price (₹) *
                        </label>
                        <input
                          name="price"
                          type="number"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="599"
                          min="0"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-black/40 mb-1.5 tracking-widest uppercase">
                          Original Price (₹)
                        </label>
                        <input
                          name="original_price"
                          type="number"
                          value={form.original_price}
                          onChange={handleChange}
                          placeholder="799"
                          min="0"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-black/40 mb-1.5 tracking-widest uppercase">
                        Category
                      </label>
                      <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">No Category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input
                        type="checkbox"
                        name="is_available"
                        id="is_available"
                        checked={form.is_available}
                        onChange={handleChange}
                        className="w-4 h-4 accent-black"
                      />
                      <label
                        htmlFor="is_available"
                        className="text-xs text-black/60 uppercase tracking-widest"
                      >
                        Available for sale
                      </label>
                    </div>
                  </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                  <ImageUploader
                    images={form.images}
                    onChange={images => setForm(f => ({ ...f, images }))}
                  />
                )}

                {/* Variants Tab */}
                {activeTab === 'variants' && (
                  <VariantManager
                    variants={form.variants}
                    onChange={variants => setForm(f => ({ ...f, variants }))}
                  />
                )}

              </div>

              {/* Error */}
              {error && (
                <div className="px-6 pb-2">
                  <p className="text-red-500 text-xs">{error}</p>
                </div>
              )}

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-black/10 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-black/20 text-black text-xs tracking-widest uppercase hover:bg-cream transition-colors"
                >
                  Cancel
                </button>

                {/* Tab navigation */}
                {activeTab !== 'variants' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const order = ['basic', 'images', 'variants']
                      const next = order[order.indexOf(activeTab) + 1]
                      setActiveTab(next)
                    }}
                    className="flex-1 py-3 border border-black text-black text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    Next →
                  </button>
                ) : null}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors disabled:bg-black/30"
                >
                  {saving
                    ? 'Saving...'
                    : editProduct
                      ? 'Update'
                      : 'Add Product'
                  }
                </button>
              </div>
            </form>

          </div>
        </>
      )}

    </div>
  )
}