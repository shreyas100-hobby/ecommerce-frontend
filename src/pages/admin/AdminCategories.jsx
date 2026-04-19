import { useEffect, useState } from 'react'
import { getCategories, adminCreateCategory, adminDeleteCategory } from '../../api'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const { data } = await getCategories()
      setCategories(data.data || [])
    } catch {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Category name is required')
      return
    }

    setSaving(true)
    setError('')
    try {
      await adminCreateCategory({ name, description })
      setName('')
      setDescription('')
      await loadCategories()
    } catch {
      setError('Failed to add category')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await adminDeleteCategory(id)
      await loadCategories()
    } catch {
      alert('Failed to delete category')
    }
  }

  const inputClass = "w-full border border-black/20 px-3 py-2.5 text-sm text-black outline-none focus:border-black bg-white placeholder:text-black/20"

  return (
    <div className="space-y-6 max-w-xl">

      {/* Header */}
      <div>
        <h2 className="font-display text-3xl text-black">Categories</h2>
        <p className="text-black/40 text-sm mt-1">{categories.length} categories</p>
      </div>

      {/* Add Form */}
      <div className="bg-white border border-black/10 p-6">
        <h3 className="font-display text-lg text-black mb-4">Add Category</h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="block text-[10px] text-black/40 mb-1.5 tracking-widest uppercase">
              Name *
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Suits, Sarees, Kurtis"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] text-black/40 mb-1.5 tracking-widest uppercase">
              Description
            </label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-black hover:bg-gold hover:text-black text-white text-xs tracking-widest uppercase font-medium transition-colors disabled:bg-black/30"
          >
            {saving ? 'Adding...' : '+ Add Category'}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white border border-black/10">
        {loading ? (
          <div className="p-8 text-center text-black/30 text-sm">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-black/30 text-sm">No categories yet</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-cream transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-black">{cat.name}</p>
                  {cat.description && (
                    <p className="text-xs text-black/30 mt-0.5">{cat.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-[10px] tracking-widest uppercase text-red-400 hover:text-red-600 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}